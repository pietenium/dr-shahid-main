import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import { Spinner } from "./Spinner";

describe("Spinner", () => {
  it("renders with default props", () => {
    const { container } = render(<Spinner />);
    const output = container.querySelector("output");
    expect(output).toBeInTheDocument();
    expect(output).toHaveClass("w-8 h-8 border-3"); // md size
    expect(output).toHaveClass("text-brand-primary"); // default color
  });

  it("renders with small size", () => {
    const { container } = render(<Spinner size="sm" />);
    const output = container.querySelector("output");
    expect(output).toHaveClass("w-4 h-4 border-2");
  });

  it("renders with large size", () => {
    const { container } = render(<Spinner size="lg" />);
    const output = container.querySelector("output");
    expect(output).toHaveClass("w-12 h-12 border-4");
  });

  it("renders with custom color", () => {
    const { container } = render(<Spinner color="red-500" />);
    const output = container.querySelector("output");
    expect(output).toHaveClass("text-red-500");
  });

  it("renders with custom className", () => {
    const { container } = render(<Spinner className="my-custom-class" />);
    const output = container.querySelector("output");
    expect(output).toHaveClass("my-custom-class");
  });
});
