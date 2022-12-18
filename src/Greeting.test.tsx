import { render, screen } from "@testing-library/react";
import Greeting from "./Greeting";

test("renders greeting component", () => {
  render(<Greeting greeting="Hello, World!" />);
  const greetingElement = screen.getByTestId("greeting-test");

  expect(greetingElement).toBeInTheDocument();
  expect(greetingElement).toHaveTextContent("Hello, World!");
});
