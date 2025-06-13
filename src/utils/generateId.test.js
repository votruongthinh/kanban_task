import { generateId } from "./generateId";

describe("generateId", () => {
  it("trả về string", () => {
    const id = generateId();
    expect(typeof id).toBe("string");
  });

  it("độ dài là 9 ký tự", () => {
    const id = generateId();
    expect(id.length).toBe(9);
  });

  it("mỗi lần gọi trả về giá trị khác nhau", () => {
    const id1 = generateId();
    const id2 = generateId();
    expect(id1).not.toBe(id2);
  });

  it("chỉ gồm các ký tự hợp lệ của toString(36)", () => {
    const id = generateId();
    expect(id).toMatch(/^[a-z0-9]{9}$/i);
  });
});
