import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { Select } from "./Select";

describe("Select", () => {
  it("renders select with options and placeholder", () => {
    render(
      <Select
        placeholder="Choose an option"
        options={[
          { value: "1", label: "Option 1" },
          { value: "2", label: "Option 2", disabled: true },
        ]}
      />
    );
    
    expect(screen.getByRole("combobox")).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "Choose an option" })).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "Option 1" })).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "Option 2" })).toBeDisabled();
  });

  it("renders error correctly", () => {
    render(
      <Select
        options={[{ value: "1", label: "Option 1" }]}
        error="Please select an option"
      />
    );
    expect(screen.getByText("Please select an option")).toBeInTheDocument();
  });
});
