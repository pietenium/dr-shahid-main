import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { Textarea } from "./Textarea";

describe("Textarea", () => {
  it("calculates character count correctly when value is provided", () => {
    render(
      <Textarea
        maxLength={100}
        value="Hello world"
        onChange={() => {}}
      />
    );
    expect(screen.getByText("11/100")).toBeInTheDocument();
  });

  it("renders helperText when error is not present", () => {
    render(<Textarea helperText="Helpful description" />);
    expect(screen.getByText("Helpful description")).toBeInTheDocument();
  });

  it("does not render helperText when error is present", () => {
    render(<Textarea helperText="Helpful description" error="Error message" />);
    expect(screen.queryByText("Helpful description")).not.toBeInTheDocument();
    expect(screen.getByText("Error message")).toBeInTheDocument();
  });
});
