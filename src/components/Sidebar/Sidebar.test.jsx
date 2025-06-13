import { render, screen, fireEvent } from "@testing-library/react";
import { vi } from "vitest";
import Sidebar from "./Sidebar";

// Mock BoardList và ThemeToggle để không bị ảnh hưởng bởi logic bên trong
vi.mock("../Sidebar/BoardList", () => ({
  __esModule: true,
  default: () => <div data-testid="board-list">Mock BoardList</div>,
}));
vi.mock("../Task/ThemeToggle", () => ({
  __esModule: true,
  default: () => <div data-testid="theme-toggle">Mock ThemeToggle</div>,
}));

// Mock zustand store
const mockToggleSidebar = vi.fn();
let isSidebarVisible = true;
vi.mock("../../store/uiStore", () => ({
  useUiStore: () => ({
    toggleSidebar: mockToggleSidebar,
    isSidebarVisible,
  }),
}));

describe("Sidebar", () => {
  beforeEach(() => {
    mockToggleSidebar.mockClear();
    isSidebarVisible = true;
  });

  it("hiển thị logo, tiêu đề, BoardList, ThemeToggle, và nút 'Đóng Sidebar'", () => {
    render(<Sidebar onOpenBoardModal={() => {}} />);
    expect(screen.getByAltText("Kanban Logo")).toBeInTheDocument();
    expect(screen.getByText("Kanban DashBoard")).toBeInTheDocument();
    expect(screen.getByTestId("board-list")).toBeInTheDocument();
    expect(screen.getByTestId("theme-toggle")).toBeInTheDocument();
    expect(screen.getByTestId("close-sidebar-btn")).toBeInTheDocument();
  });

  it("gọi toggleSidebar khi click nút 'Đóng Sidebar'", () => {
    render(<Sidebar onOpenBoardModal={() => {}} />);
    fireEvent.click(screen.getByTestId("close-sidebar-btn"));
    expect(mockToggleSidebar).toHaveBeenCalled();
  });

  it("ẩn sidebar khi isSidebarVisible là false", () => {
    isSidebarVisible = false;
    render(<Sidebar onOpenBoardModal={() => {}} />);
    const sidebar = screen.getByTestId("sidebar");
    expect(sidebar.className).toMatch(/-translate-x-full/);
  });

  it("hiện sidebar khi isSidebarVisible là true", () => {
    isSidebarVisible = true;
    render(<Sidebar onOpenBoardModal={() => {}} />);
    const sidebar = screen.getByTestId("sidebar");
    expect(sidebar.className).toMatch(/translate-x-0/);
  });
});
