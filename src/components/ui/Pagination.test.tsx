import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Pagination } from "./Pagination";

// Mock next/navigation
vi.mock("next/navigation", () => ({
  useSearchParams: vi.fn().mockReturnValue(new URLSearchParams("")),
}));

describe("Pagination", () => {
  it("renders correct number of pages", () => {
    render(<Pagination currentPage={1} totalPages={3} basePath="/articles" />);
    expect(screen.getByText("1")).toBeInTheDocument();
    expect(screen.getByText("2")).toBeInTheDocument();
    expect(screen.getByText("3")).toBeInTheDocument();
  });

  it("does not render if totalPages is 1", () => {
    const { container } = render(<Pagination currentPage={1} totalPages={1} />);
    expect(container).toBeEmptyDOMElement();
  });

  it("calls onPageChange when provided", async () => {
    const onPageChange = vi.fn();
    const user = userEvent.setup();
    render(<Pagination currentPage={1} totalPages={3} onPageChange={onPageChange} />);

    await user.click(screen.getByText("2"));
    expect(onPageChange).toHaveBeenCalledWith(2);
  });

  it("renders links if onPageChange is not provided", () => {
    render(<Pagination currentPage={1} totalPages={3} basePath="/articles" />);
    expect(screen.getByText("2").closest("a")).toHaveAttribute("href", "/articles?page=2");
  });
});
