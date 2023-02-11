import { useContext } from "react";
import { ModalControlContext } from "./ModalControlContext";

export default function useModalControlContext() {
  const context = useContext(ModalControlContext);
  if (!context) {
    throw new Error(
      "useModalControlContext must be used within a ModalControlStateProvider"
    );
  }
  return context;
}
