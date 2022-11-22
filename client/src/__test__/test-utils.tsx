import { render, RenderOptions } from "@testing-library/react";
import { ReactElement } from "react";
import AppProvider from "../AppProvider";

function renderInProvider(
  ui: ReactElement,
  options?: Omit<RenderOptions, "wrapper">
) {
  return render(<AppProvider>{ui}</AppProvider>, options);
}

export default renderInProvider;
