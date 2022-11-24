import { screen } from "@testing-library/react";
import { createMemoryHistory } from "history";
import App from "../App";
import { CLIENT_ROUTE } from "../constant";
import renderInProvider from "./test-utils";

describe("App", () => {
  test("renders", () => {
    renderInProvider(<App />);
    const main = screen.getByRole("main");
    const header = screen.getByRole("heading");
    const navBar = screen.getByRole("navigation");
    expect(main).toBeInTheDocument();
    expect(header).toBeInTheDocument();
    expect(navBar).toBeInTheDocument();

    const history = createMemoryHistory();
    expect(history.location.pathname).toBe(CLIENT_ROUTE.HOME);

    // const homeText = screen.getByText("Under construction");
    // expect(homeText).toBeInTheDocument();
  });
});
