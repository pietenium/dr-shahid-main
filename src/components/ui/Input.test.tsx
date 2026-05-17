import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { Input } from "./Input";

describe("Input", () => {
  it("renders leftIcon and rightIcon correctly", () => {
    render(
      <Input
        leftIcon={<span data-testid="left-icon" />}
        rightIcon={<span data-testid="right-icon" />}
        placeholder="Search"
      />
    );
    expect(screen.getByTestId("left-icon")).toBeInTheDocument();
    expect(screen.getByTestId("right-icon")).toBeInTheDocument();
  });

  it("renders helperText when error is not present", () => {
    render(<Input helperText="This is helpful" />);
    expect(screen.getByText("This is helpful")).toBeInTheDocument();
  });

  it("does not render helperText when error is present", () => {
    render(<Input helperText="This is helpful" error="Something went wrong" />);
    expect(screen.queryByText("This is helpful")).not.toBeInTheDocument();
    expect(screen.getByText("Something went wrong")).toBeInTheDocument();
  });
});
