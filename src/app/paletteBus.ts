// Tiny event bus so any component (sidebar button, Ctrl+K, dashboard) can open the palette.
const EVENT = "cv:palette";
export const openPalette = () => dispatchEvent(new Event(EVENT));
export function onPaletteOpen(fn: () => void) {
  addEventListener(EVENT, fn);
  return () => removeEventListener(EVENT, fn);
}
