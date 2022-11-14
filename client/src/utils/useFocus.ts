import { useRef } from "react";

export function useFocus<T extends HTMLElement>() {
  const htmlElRef = useRef<T | null>(null);

  const setFocus = () => {
    const currentEl = htmlElRef.current;
    currentEl && currentEl.focus();
  };
  return [htmlElRef, setFocus] as const;
}
