import { createContext, useContext } from 'react';
import type Lenis from 'lenis';

export type ScrollApi = {
  lenis: Lenis | null;
  scrollTo: (target: string | number | HTMLElement, offset?: number) => void;
  stop: () => void;
  start: () => void;
};

export const ScrollContext = createContext<ScrollApi>({
  lenis: null,
  scrollTo: () => undefined,
  stop: () => undefined,
  start: () => undefined,
});

export const useScrollApi = () => useContext(ScrollContext);
