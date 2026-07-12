"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Icon } from "@/components/icons/Icon";
import { toPersianDigits } from "@/lib/format";

type Step = "phone" | "code";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") || "/account";

  const [step, setStep] = useState<Step>("phone");
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [devHint, setDevHint] = useState<string | null>(null);
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setInterval(() => setCooldown((c) => Math.max(0, c - 1)), 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

  async function requestCode(e?: React.FormEvent) {
    e?.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/auth/request-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message ?? "خطایی رخ داد.");
        return;
      }
      setDevHint(data.dev_code ? `${data.dev_note} کد: ${toPersianDigits(data.dev_code)}` : null);
      setStep("code");
      setCooldown(60);
    } catch {
      setError("ارتباط با سرور برقرار نشد.");
    } finally {
      setLoading(false);
    }
  }

  async function verifyCode(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, code }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message ?? "کد وارد شده صحیح نیست.");
        return;
      }
      router.push(next);
      router.refresh();
    } catch {
      setError("ارتباط با سرور برقرار نشد.");
    } finally {
      setLoading(false);
    }
  }

  if (step === "phone") {
    return (
      <div className="auth-card bracket">
        <h1 className="disp">ورود به آیریک</h1>
        <p>شماره موبایل خود را وارد کنید تا کد یکبارمصرف برایتان پیامک شود.</p>
        <form onSubmit={requestCode}>
          <div className="form-field">
            <label htmlFor="phone">شماره موبایل</label>
            <input
              id="phone"
              type="tel"
              inputMode="numeric"
              autoComplete="tel"
              placeholder="۰۹۱۲۱۲۳۴۵۶۷"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
              dir="ltr"
              style={{ textAlign: "left" }}
            />
          </div>
          {error && (
            <p className="form-error">
              <Icon name="x" className="icon icon-sm" />
              {error}
            </p>
          )}
          <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
            {loading ? "در حال ارسال…" : "ارسال کد ورود"}
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="auth-card bracket">
      <h1 className="disp">کد تایید را وارد کنید</h1>
      <p>کد ۶ رقمی ارسال‌شده به {toPersianDigits(phone)} را وارد کنید.</p>
      {devHint && <p className="otp-dev-hint">{devHint}</p>}
      <form onSubmit={verifyCode}>
        <div className="form-field">
          <label htmlFor="code">کد تایید</label>
          <input
            id="code"
            type="text"
            inputMode="numeric"
            autoComplete="one-time-code"
            maxLength={6}
            placeholder="——————"
            value={code}
            onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
            required
            dir="ltr"
            style={{ textAlign: "center", letterSpacing: "0.5em", fontSize: "1.2rem" }}
          />
        </div>
        {error && (
          <p className="form-error">
            <Icon name="x" className="icon icon-sm" />
            {error}
          </p>
        )}
        <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
          {loading ? "در حال بررسی…" : "تایید و ورود"}
        </button>
        <div className="form-actions-row">
          <button type="button" onClick={() => setStep("phone")}>
            ویرایش شماره موبایل
          </button>
          <button type="button" onClick={() => requestCode()} disabled={cooldown > 0 || loading}>
            {cooldown > 0 ? `ارسال مجدد (${toPersianDigits(cooldown)})` : "ارسال مجدد کد"}
          </button>
        </div>
      </form>
    </div>
  );
}
