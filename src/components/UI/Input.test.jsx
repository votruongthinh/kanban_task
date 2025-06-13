import { render, screen, fireEvent } from "@testing-library/react";
import Input from "./Input";

describe("Input", () => {
  it("render với placeholder đúng", () => {
    render(<Input placeholder="Nhập tên..." />);
    expect(screen.getByPlaceholderText("Nhập tên...")).toBeInTheDocument();
  });

  it("nhận value và onChange đúng", () => {
    const handleChange = vi.fn();
    render(<Input value="abc" onChange={handleChange} />);
    const input = screen.getByDisplayValue("abc");
    fireEvent.change(input, { target: { value: "xyz" } });
    expect(handleChange).toHaveBeenCalled();
  });

  it("áp dụng className bổ sung", () => {
    render(<Input data-testid="my-input" className="test-class" />);
    const input = screen.getByTestId("my-input");
    expect(input.className).toMatch(/test-class/);
  });

  it("có class mặc định", () => {
    render(<Input data-testid="my-input" />);
    const input = screen.getByTestId("my-input");
    expect(input.className).toMatch(/w-full/);
    expect(input.className).toMatch(/bg-gray-100/);
    expect(input.className).toMatch(/rounded/);
  });
});
