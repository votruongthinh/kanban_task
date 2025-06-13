import { useUiStore } from "./uiStore";

describe("useUiStore", () => {
  beforeEach(() => {
    useUiStore.setState({
      isDarkMode: false,
      isSidebarVisible: true,
    });
    window.localStorage.removeItem("ui-storage");
  });

  it("có giá trị mặc định đúng", () => {
    expect(useUiStore.getState().isDarkMode).toBe(false);
    expect(useUiStore.getState().isSidebarVisible).toBe(true);
  });

  it("toggleTheme đảo trạng thái dark mode", () => {
    useUiStore.getState().toggleTheme();
    expect(useUiStore.getState().isDarkMode).toBe(true);
    useUiStore.getState().toggleTheme();
    expect(useUiStore.getState().isDarkMode).toBe(false);
  });

  it("toggleSidebar đảo trạng thái sidebar", () => {
    useUiStore.getState().toggleSidebar();
    expect(useUiStore.getState().isSidebarVisible).toBe(false);
    useUiStore.getState().toggleSidebar();
    expect(useUiStore.getState().isSidebarVisible).toBe(true);
  });
});
