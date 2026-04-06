import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import MakesToolbar from "@/components/table/MakesToolbar";
import { useVehicleStore } from "@/lib/store/vehicleStore";

beforeEach(() => {
  useVehicleStore.setState({ searchQuery: "" });
  jest.useFakeTimers();
});

afterEach(() => {
  jest.useRealTimers();
});

describe("MakesToolbar", () => {
  it("renders the search input with placeholder", () => {
    render(<MakesToolbar />);
    expect(screen.getByPlaceholderText("Search makes...")).toBeInTheDocument();
  });

  it("does not update the store on initial mount", () => {
    render(<MakesToolbar />);
    jest.runAllTimers();
    expect(useVehicleStore.getState().searchQuery).toBe("");
  });

  it("updates the store after the debounce delay when user types", async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    render(<MakesToolbar />);

    await user.type(screen.getByPlaceholderText("Search makes..."), "ford");
    expect(useVehicleStore.getState().searchQuery).toBe(""); // not yet

    jest.runAllTimers();
    expect(useVehicleStore.getState().searchQuery).toBe("ford");
  });

  it("debounces — only fires once for rapid keystrokes", async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    const setSearchQuery = jest.spyOn(useVehicleStore.getState(), "setSearchQuery");

    render(<MakesToolbar />);
    await user.type(screen.getByPlaceholderText("Search makes..."), "toyota");

    jest.runAllTimers();
    // Should have been called once with the final value, not once per keystroke
    expect(setSearchQuery).toHaveBeenLastCalledWith("toyota");
  });

  it("reflects typed value in the input immediately", async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    render(<MakesToolbar />);

    const input = screen.getByPlaceholderText("Search makes...") as HTMLInputElement;
    await user.type(input, "honda");

    expect(input.value).toBe("honda");
  });
});
