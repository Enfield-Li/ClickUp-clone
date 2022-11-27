import { screen } from "@testing-library/react";
import user from "@testing-library/user-event";
import * as router from "react-router";
import NavBar from "../component/layout/NavBar";
import { CLIENT_ROUTE } from "../constant";
import renderInProvider from "./test-utils";

const navigate = jest.fn();
beforeEach(() => {
  // https://stackoverflow.com/a/72289488/16648127
  jest.spyOn(router, "useNavigate").mockImplementation(() => navigate);
});

describe("App", () => {
  test("renders", () => {
    renderInProvider(<NavBar />);
    const navBar = screen.getByRole("navigation");
    expect(navBar).toBeInTheDocument();
  });

  test("render correct amount of icons", () => {
    renderInProvider(<NavBar />);
    const icons = screen.getAllByRole("menuitem");
    expect(icons).toHaveLength(3);
  });

  test("click to navigate to home", async () => {
    renderInProvider(<NavBar />);

    const logo = screen.getByRole("menuitem", { name: "logo" });
    await user.click(logo);
    expect(navigate).toHaveBeenCalledWith(CLIENT_ROUTE.HOME);
  });

  test("click to navigate to task", async () => {
    renderInProvider(<NavBar />);

    const taskIcon = screen.getByRole("menuitem", { name: "Task" });
    await user.click(taskIcon);
    expect(navigate).toHaveBeenCalledWith(CLIENT_ROUTE.TASK_BOARD);
  });

  test("click to navigate to dev test", async () => {
    renderInProvider(<NavBar />);

    const testSection = screen.getByRole("menuitem", { name: "test" });
    await user.click(testSection);
    expect(navigate).toHaveBeenCalledWith(CLIENT_ROUTE.TEST_DEV);
  });
});
