import { useRef } from "react";

export function useFocus() {
  const htmlElRef = useRef<HTMLElement>();

  const setFocus = () => {
    console.log("setFocus");
    const currentEl = htmlElRef.current;
    currentEl && currentEl.focus();
  };
  return [htmlElRef, setFocus] as const;
}
