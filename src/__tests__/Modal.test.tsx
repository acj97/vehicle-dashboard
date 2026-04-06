import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import Modal from "@/components/ui/Modal";

const onClose = jest.fn();

beforeEach(() => onClose.mockClear());

describe("Modal", () => {
  it("renders nothing when open is false", () => {
    render(
      <Modal open={false} onClose={onClose} title="Test">
        <p>Content</p>
      </Modal>
    );
    expect(screen.queryByText("Test")).not.toBeInTheDocument();
    expect(screen.queryByText("Content")).not.toBeInTheDocument();
  });

  it("renders title and children when open is true", () => {
    render(
      <Modal open={true} onClose={onClose} title="Vehicle Detail">
        <p>Toyota Camry</p>
      </Modal>
    );
    expect(screen.getByText("Vehicle Detail")).toBeInTheDocument();
    expect(screen.getByText("Toyota Camry")).toBeInTheDocument();
  });

  it("renders subtitle when provided", () => {
    render(
      <Modal open={true} onClose={onClose} title="Title" subtitle="Make ID — #1">
        <p>Content</p>
      </Modal>
    );
    expect(screen.getByText("Make ID — #1")).toBeInTheDocument();
  });

  it("does not render subtitle when omitted", () => {
    render(
      <Modal open={true} onClose={onClose} title="Title">
        <p>Content</p>
      </Modal>
    );
    expect(screen.queryByText("Make ID")).not.toBeInTheDocument();
  });

  it("calls onClose when the X button is clicked", () => {
    render(
      <Modal open={true} onClose={onClose} title="Title">
        <p>Content</p>
      </Modal>
    );
    fireEvent.click(screen.getByRole("button"));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("calls onClose when the backdrop is clicked", () => {
    const { container } = render(
      <Modal open={true} onClose={onClose} title="Title">
        <p>Content</p>
      </Modal>
    );
    // Backdrop is the first child of the fixed container
    const backdrop = container.querySelector(".absolute.inset-0") as HTMLElement;
    fireEvent.click(backdrop);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("calls onClose when Escape is pressed", () => {
    render(
      <Modal open={true} onClose={onClose} title="Title">
        <p>Content</p>
      </Modal>
    );
    fireEvent.keyDown(window, { key: "Escape" });
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("does not call onClose for non-Escape keys", () => {
    render(
      <Modal open={true} onClose={onClose} title="Title">
        <p>Content</p>
      </Modal>
    );
    fireEvent.keyDown(window, { key: "Enter" });
    expect(onClose).not.toHaveBeenCalled();
  });

  it("locks body scroll when open", () => {
    render(
      <Modal open={true} onClose={onClose} title="Title">
        <p>Content</p>
      </Modal>
    );
    expect(document.body.style.overflow).toBe("hidden");
  });

  it("restores body scroll when unmounted", () => {
    const { unmount } = render(
      <Modal open={true} onClose={onClose} title="Title">
        <p>Content</p>
      </Modal>
    );
    unmount();
    expect(document.body.style.overflow).toBe("");
  });
});
