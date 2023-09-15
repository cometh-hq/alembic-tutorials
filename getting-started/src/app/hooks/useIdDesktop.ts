import { useWindowSize } from "usehooks-ts";

const TABLET_SCREEN = 768;

export function useIsDesktop() {
  const { width } = useWindowSize();
  return width >= TABLET_SCREEN;
}
