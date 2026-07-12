export type IconName =
  | "search"
  | "cart"
  | "user"
  | "heart"
  | "heart-fill"
  | "star"
  | "star-o"
  | "chev-down"
  | "chev-start"
  | "chev-end"
  | "check"
  | "x"
  | "filter"
  | "grid"
  | "list"
  | "phone"
  | "pin"
  | "mail"
  | "menu"
  | "truck"
  | "shield"
  | "card"
  | "headset"
  | "clock"
  | "plus"
  | "minus"
  | "laptop"
  | "desktop"
  | "gamepad"
  | "monitor"
  | "cpu"
  | "drive"
  | "wifi"
  | "keyboard"
  | "mouse"
  | "chip-brand";

export function Icon({
  name,
  className = "icon",
  style,
}: {
  name: IconName;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <svg className={className} style={style} aria-hidden="true">
      <use href={`#i-${name}`} />
    </svg>
  );
}
