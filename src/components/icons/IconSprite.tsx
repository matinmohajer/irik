/**
 * Single inline sprite sheet, rendered once in the root layout.
 * Icons are referenced elsewhere via <Icon name="..." />.
 */
export function IconSprite() {
  return (
    <svg style={{ display: "none" }} aria-hidden="true">
      <defs>
        <symbol id="i-search" viewBox="0 0 24 24">
          <circle cx="11" cy="11" r="7" />
          <line x1="21" y1="21" x2="16.2" y2="16.2" />
        </symbol>
        <symbol id="i-cart" viewBox="0 0 24 24">
          <circle cx="9" cy="21" r="1.4" fill="currentColor" stroke="none" />
          <circle cx="18" cy="21" r="1.4" fill="currentColor" stroke="none" />
          <path d="M2.5 3h2.4l2.1 12.2a2 2 0 0 0 2 1.65h8.3a2 2 0 0 0 1.97-1.63L21 8H6.2" />
        </symbol>
        <symbol id="i-user" viewBox="0 0 24 24">
          <circle cx="12" cy="8" r="3.6" />
          <path d="M4.5 20c1.3-3.7 4.2-5.6 7.5-5.6s6.2 1.9 7.5 5.6" />
        </symbol>
        <symbol id="i-heart" viewBox="0 0 24 24">
          <path d="M12 20.2s-7.6-4.6-9.8-9.3C.6 7.1 2.6 3.7 6 3.2c2-.3 3.9.6 5 2.3 1.1-1.7 3-2.6 5-2.3 3.4.5 5.4 3.9 3.8 7.7-2.2 4.7-9.8 9.3-9.8 9.3z" />
        </symbol>
        <symbol id="i-heart-fill" viewBox="0 0 24 24">
          <path
            d="M12 20.2s-7.6-4.6-9.8-9.3C.6 7.1 2.6 3.7 6 3.2c2-.3 3.9.6 5 2.3 1.1-1.7 3-2.6 5-2.3 3.4.5 5.4 3.9 3.8 7.7-2.2 4.7-9.8 9.3-9.8 9.3z"
            fill="currentColor"
          />
        </symbol>
        <symbol id="i-star" viewBox="0 0 24 24">
          <path
            d="M12 2.8l2.9 6 6.5.7-4.9 4.5 1.3 6.5-5.8-3.3-5.8 3.3 1.3-6.5-4.9-4.5 6.5-.7z"
            fill="currentColor"
            stroke="none"
          />
        </symbol>
        <symbol id="i-star-o" viewBox="0 0 24 24">
          <path d="M12 2.8l2.9 6 6.5.7-4.9 4.5 1.3 6.5-5.8-3.3-5.8 3.3 1.3-6.5-4.9-4.5 6.5-.7z" />
        </symbol>
        <symbol id="i-chev-down" viewBox="0 0 24 24">
          <polyline points="5,8.5 12,15.5 19,8.5" />
        </symbol>
        <symbol id="i-chev-start" viewBox="0 0 24 24">
          <polyline points="15,5 8,12 15,19" />
        </symbol>
        <symbol id="i-chev-end" viewBox="0 0 24 24">
          <polyline points="9,5 16,12 9,19" />
        </symbol>
        <symbol id="i-check" viewBox="0 0 24 24">
          <polyline points="4,13 9,18 20,6" />
        </symbol>
        <symbol id="i-x" viewBox="0 0 24 24">
          <line x1="5" y1="5" x2="19" y2="19" />
          <line x1="19" y1="5" x2="5" y2="19" />
        </symbol>
        <symbol id="i-filter" viewBox="0 0 24 24">
          <line x1="4" y1="6" x2="20" y2="6" />
          <line x1="7" y1="12" x2="17" y2="12" />
          <line x1="10" y1="18" x2="14" y2="18" />
        </symbol>
        <symbol id="i-grid" viewBox="0 0 24 24">
          <rect x="3.5" y="3.5" width="7" height="7" rx="1" />
          <rect x="13.5" y="3.5" width="7" height="7" rx="1" />
          <rect x="3.5" y="13.5" width="7" height="7" rx="1" />
          <rect x="13.5" y="13.5" width="7" height="7" rx="1" />
        </symbol>
        <symbol id="i-list" viewBox="0 0 24 24">
          <line x1="8" y1="6" x2="21" y2="6" />
          <line x1="8" y1="12" x2="21" y2="12" />
          <line x1="8" y1="18" x2="21" y2="18" />
          <line x1="3.5" y1="6" x2="3.51" y2="6" />
          <line x1="3.5" y1="12" x2="3.51" y2="12" />
          <line x1="3.5" y1="18" x2="3.51" y2="18" />
        </symbol>
        <symbol id="i-phone" viewBox="0 0 24 24">
          <path d="M6.6 10.8c1.4 2.8 3.8 5.2 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.3 1.1.4 2.3.6 3.5.6.6 0 1 .4 1 1v3.4c0 .6-.4 1-1 1C10.5 21 3 13.5 3 4.1c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.2.2 2.4.6 3.5.1.3 0 .7-.3 1z" />
        </symbol>
        <symbol id="i-pin" viewBox="0 0 24 24">
          <path d="M12 21.5S4.7 14.4 4.7 9.3a7.3 7.3 0 1 1 14.6 0c0 5.1-7.3 12.2-7.3 12.2z" />
          <circle cx="12" cy="9.3" r="2.6" />
        </symbol>
        <symbol id="i-mail" viewBox="0 0 24 24">
          <rect x="3" y="5" width="18" height="14" rx="2" />
          <polyline points="3.5,6 12,13 20.5,6" />
        </symbol>
        <symbol id="i-menu" viewBox="0 0 24 24">
          <line x1="4" y1="7" x2="20" y2="7" />
          <line x1="4" y1="12" x2="20" y2="12" />
          <line x1="4" y1="17" x2="20" y2="17" />
        </symbol>
        <symbol id="i-truck" viewBox="0 0 24 24">
          <rect x="2" y="7" width="12" height="10" />
          <path d="M14 10h4l4 3.5V17h-8z" />
          <circle cx="7" cy="19" r="1.7" />
          <circle cx="17.5" cy="19" r="1.7" />
        </symbol>
        <symbol id="i-shield" viewBox="0 0 24 24">
          <path d="M12 3l7.5 3v5.2c0 5-3.2 8.4-7.5 10-4.3-1.6-7.5-5-7.5-10V6z" />
          <polyline points="8.7,12.2 11,14.5 15.5,9.8" />
        </symbol>
        <symbol id="i-card" viewBox="0 0 24 24">
          <rect x="2.5" y="5.5" width="19" height="13" rx="2" />
          <line x1="2.5" y1="10" x2="21.5" y2="10" />
          <line x1="6" y1="14.5" x2="10" y2="14.5" />
        </symbol>
        <symbol id="i-headset" viewBox="0 0 24 24">
          <path d="M4 13v-1a8 8 0 0 1 16 0v1" />
          <rect x="2.5" y="13" width="4.5" height="6" rx="1.5" />
          <rect x="17" y="13" width="4.5" height="6" rx="1.5" />
          <path d="M19.3 19.2v.8a3 3 0 0 1-3 3H13" />
        </symbol>
        <symbol id="i-clock" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="8.5" />
          <polyline points="12,7.3 12,12 15.5,14.3" />
        </symbol>
        <symbol id="i-plus" viewBox="0 0 24 24">
          <line x1="12" y1="5" x2="12" y2="19" />
          <line x1="5" y1="12" x2="19" y2="12" />
        </symbol>
        <symbol id="i-minus" viewBox="0 0 24 24">
          <line x1="5" y1="12" x2="19" y2="12" />
        </symbol>
        <symbol id="i-laptop" viewBox="0 0 24 24">
          <rect x="4.5" y="4.5" width="15" height="10" rx="1" />
          <path d="M2 19.5h20l-1.8-3.3H3.8z" />
          <line x1="10" y1="17.4" x2="14" y2="17.4" />
        </symbol>
        <symbol id="i-desktop" viewBox="0 0 24 24">
          <rect x="4" y="4" width="12" height="14" rx="1" />
          <line x1="8" y1="8" x2="12" y2="8" />
          <line x1="8" y1="11" x2="12" y2="11" />
          <rect x="17.5" y="9" width="3.5" height="9" rx="1" />
        </symbol>
        <symbol id="i-gamepad" viewBox="0 0 24 24">
          <path d="M6.5 8h11a4 4 0 0 1 4 4.6l-.6 3.3a2.3 2.3 0 0 1-3.9 1.2L15.3 15H8.7l-1.7 2.1a2.3 2.3 0 0 1-3.9-1.2l-.6-3.3A4 4 0 0 1 6.5 8z" />
          <line x1="7.2" y1="11.3" x2="7.2" y2="13.7" />
          <line x1="6" y1="12.5" x2="8.4" y2="12.5" />
          <circle cx="17" cy="11.3" r=".6" fill="currentColor" stroke="none" />
          <circle cx="15.2" cy="13" r=".6" fill="currentColor" stroke="none" />
        </symbol>
        <symbol id="i-monitor" viewBox="0 0 24 24">
          <rect x="3" y="4.5" width="18" height="12" rx="1.3" />
          <line x1="9" y1="20" x2="15" y2="20" />
          <line x1="12" y1="16.5" x2="12" y2="20" />
        </symbol>
        <symbol id="i-cpu" viewBox="0 0 24 24">
          <rect x="7" y="7" width="10" height="10" rx="1" />
          <rect x="10" y="10" width="4" height="4" />
          <line x1="12" y1="2" x2="12" y2="5.2" />
          <line x1="12" y1="18.8" x2="12" y2="22" />
          <line x1="2" y1="12" x2="5.2" y2="12" />
          <line x1="18.8" y1="12" x2="22" y2="12" />
          <line x1="5" y1="5" x2="7.2" y2="7.2" />
          <line x1="16.8" y1="16.8" x2="19" y2="19" />
        </symbol>
        <symbol id="i-drive" viewBox="0 0 24 24">
          <rect x="3" y="6" width="18" height="12" rx="2" />
          <circle cx="8" cy="12" r="1" fill="currentColor" stroke="none" />
          <line x1="12" y1="12" x2="17.5" y2="12" />
        </symbol>
        <symbol id="i-wifi" viewBox="0 0 24 24">
          <path d="M4 9a12 12 0 0 1 16 0" />
          <path d="M7 12.8a7.6 7.6 0 0 1 10 0" />
          <path d="M10 16.5a3.2 3.2 0 0 1 4 0" />
          <circle cx="12" cy="19.5" r="1" fill="currentColor" stroke="none" />
        </symbol>
        <symbol id="i-keyboard" viewBox="0 0 24 24">
          <rect x="2.5" y="6" width="19" height="12" rx="1.3" />
          <line x1="6" y1="10" x2="6.01" y2="10" />
          <line x1="9" y1="10" x2="9.01" y2="10" />
          <line x1="12" y1="10" x2="12.01" y2="10" />
          <line x1="15" y1="10" x2="15.01" y2="10" />
          <line x1="18" y1="10" x2="18.01" y2="10" />
          <line x1="7" y1="14.3" x2="17" y2="14.3" />
        </symbol>
        <symbol id="i-mouse" viewBox="0 0 24 24">
          <rect x="7" y="3" width="10" height="18" rx="5" />
          <line x1="12" y1="3" x2="12" y2="10" />
        </symbol>
        <symbol id="i-chip-brand" viewBox="0 0 24 24">
          <rect x="5" y="5" width="14" height="14" rx="3" />
          <path d="M9 12h6M12 9v6" strokeWidth="1.4" />
        </symbol>
      </defs>
    </svg>
  );
}
