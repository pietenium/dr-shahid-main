import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Modal } from "./Modal";

describe("Modal", () => {
  it("renders when isOpen is true", () => {
    render(
      <Modal isOpen={true} onClose={() => {}} title="Test Modal">
        <p>Modal content</p>
      </Modal>
    );
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByText("Test Modal")).toBeInTheDocument();
    expect(screen.getByText("Modal content")).toBeInTheDocument();
  });

  it("does not render when isOpen is false", () => {
    render(
      <Modal isOpen={false} onClose={() => {}} title="Test">
        <p>Content</p>
      </Modal>
    );
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("calls onClose when close button clicked", async () => {
    const onClose = vi.fn();
    const user = userEvent.setup();
    render(
      <Modal isOpen={true} onClose={onClose} title="Test">
        <p>Content</p>
      </Modal>
    );

    await user.click(screen.getByLabelText("Close modal"));
    expect(onClose).toHaveBeenCalledOnce();
  });

  it("calls onClose when Escape key pressed", async () => {
    const onClose = vi.fn();
    render(
      <Modal isOpen={true} onClose={onClose} title="Test">
        <p>Content</p>
      </Modal>
    );

    await userEvent.keyboard("{Escape}");
    expect(onClose).toHaveBeenCalledOnce();
  });

  it("traps focus within modal (Tab cycles)", async () => {
    const onClose = vi.fn();
    const user = userEvent.setup();
    render(
      <Modal isOpen={true} onClose={onClose} title="Test">
        <button type="button">First</button>
        <button type="button">Second</button>
      </Modal>
    );

    const closeButton = screen.getByLabelText("Close modal");
    const firstButton = screen.getByText("First");
    const secondButton = screen.getByText("Second");

    // Explicitly focus Close modal
    closeButton.focus();
    expect(closeButton).toHaveFocus();

    // Tab from Close modal should focus "First"
    await user.tab();
    expect(firstButton).toHaveFocus();

    // Tab from "First" should focus "Second"
    await user.tab();
    expect(secondButton).toHaveFocus();

    // Tab from "Second" should cycle back to Close modal
    await user.tab();
    expect(closeButton).toHaveFocus();

    // Shift+Tab from Close modal should cycle to "Second"
    await user.tab({ shift: true });
    expect(secondButton).toHaveFocus();

    // Shift+Tab from "Second" should focus "First"
    await user.tab({ shift: true });
    expect(firstButton).toHaveFocus();

    // Shift+Tab from "First" should focus Close modal
    await user.tab({ shift: true });
    expect(closeButton).toHaveFocus();
  });
});
