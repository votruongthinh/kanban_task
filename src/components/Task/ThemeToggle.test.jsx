import { render, screen, fireEvent } from "@testing-library/react";
import { vi } from "vitest";
import ThemeToggle from "./ThemeToggle";

// Mock react-icons
vi.mock("react-icons/fa", () => ({
  FaMoon: () => <span data-testid="moon" />,
  FaSun: () => <span data-testid="sun" />,
}));

// Mock zustand store
const mockToggleTheme = vi.fn();
let isDarkModeValue = false;

vi.mock("../../store/uiStore", () => ({
  useUiStore: (selector) =>
    selector
      ? selector({
          isDarkMode: isDarkModeValue,
          toggleTheme: mockToggleTheme,
        })
      : {
          isDarkMode: isDarkModeValue,
          toggleTheme: mockToggleTheme,
        },
}));

describe("ThemeToggle", () => {
  beforeEach(() => {
    mockToggleTheme.mockClear();
  });

  it("hiển thị icon Sun khi ở light mode", () => {
    isDarkModeValue = false;
    render(<ThemeToggle />);
    expect(screen.getByTestId("sun")).toBeInTheDocument();
    expect(screen.queryByTestId("moon")).not.toBeInTheDocument();
  });

  it("hiển thị icon Moon khi ở dark mode", () => {
    isDarkModeValue = true;
    render(<ThemeToggle />);
    expect(screen.getByTestId("moon")).toBeInTheDocument();
    expect(screen.queryByTestId("sun")).not.toBeInTheDocument();
  });

  it("gọi toggleTheme khi click vào button", () => {
    isDarkModeValue = false;
    render(<ThemeToggle />);
    fireEvent.click(screen.getByRole("button"));
    expect(mockToggleTheme).toHaveBeenCalled();
  });

  it("có class translate-x-5 khi dark mode và translate-x-0 khi light mode", () => {
    isDarkModeValue = false;
    const { rerender } = render(<ThemeToggle />);
    const circle = screen.getByRole("button").querySelector("div");
    expect(circle.className).toMatch(/translate-x-0/);

    isDarkModeValue = true;
    rerender(<ThemeToggle />);
    expect(circle.className).toMatch(/translate-x-5/);
  });
});
