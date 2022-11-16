import { render, screen } from "@testing-library/react";
import App from "../App";

describe("App", () => {
  it("should work as expected", () => {
    render(<App />);
    const text = screen.getByText("count is:");
    expect(text).toBeInTheDocument();
  });

  test("something", () => {
    render(<App />);
    const text = screen.getByText("count is:");
    expect(text).toBeInTheDocument();
  });
});
