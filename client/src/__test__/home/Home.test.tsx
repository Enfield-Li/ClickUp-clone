import { screen } from "@testing-library/react";
import Home from "../../component/layout/Home";
import renderInProvider from "../test-utils";

describe("App", () => {
  it("renders", () => {
    renderInProvider(<Home />);
    const paragraphElement = screen.getByText("Under construction");
    expect(paragraphElement).toBeInTheDocument();
  });
});
