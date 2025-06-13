import { saveToLocalStorage, loadFromLocalStorage } from "./localStorage.js";

describe("saveToLocalStorage & loadFromLocalStorage", () => {
  const key = "my-key";

  beforeEach(() => {
    localStorage.clear();
  });

  it("lưu và lấy lại object đúng", () => {
    const data = { a: 1, b: "hello" };
    saveToLocalStorage(key, data);
    const result = loadFromLocalStorage(key);
    expect(result).toEqual(data);
  });

  it("lưu và lấy lại array đúng", () => {
    const data = [1, 2, 3];
    saveToLocalStorage(key, data);
    const result = loadFromLocalStorage(key);
    expect(result).toEqual(data);
  });

  it("lưu và lấy lại primitive (string, number)", () => {
    saveToLocalStorage(key, "abc");
    expect(loadFromLocalStorage(key)).toBe("abc");
    saveToLocalStorage(key, 123);
    expect(loadFromLocalStorage(key)).toBe(123);
  });

  it("trả về null nếu key chưa tồn tại", () => {
    expect(loadFromLocalStorage("not-exist-key")).toBeNull();
  });

  it("ghi đè key cũ khi lưu mới", () => {
    saveToLocalStorage(key, "first");
    saveToLocalStorage(key, "second");
    expect(loadFromLocalStorage(key)).toBe("second");
  });
});
