import { render, screen } from "@testing-library/react";
import Greeting from "./Greeting";

test("renders greeting component", () => {
  render(<Greeting />);
  const greetingElement = screen.getByTestId("greeting-test");

  expect(greetingElement).toBeInTheDocument();
  expect(greetingElement).toHaveTextContent("Hello, World!");
});
