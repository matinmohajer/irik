/**
 * next/image routes every src through its optimizer, which refuses SVGs
 * unless `unoptimized` is set (see next.js docs on `dangerouslyAllowSVG`).
 * The bundled placeholder art is SVG; real WooCommerce/WP photos will be
 * JPEG/PNG, so this only ever applies to the mock content.
 */
export function isSvgPath(src: string): boolean {
  return src.toLowerCase().endsWith(".svg");
}
