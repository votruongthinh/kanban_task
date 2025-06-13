import { render, screen, fireEvent } from "@testing-library/react";
import Modal from "./Modal";

describe("Modal", () => {
  it("không render gì nếu isOpen=false", () => {
    const { container } = render(
      <Modal isOpen={false} onClose={() => {}} title="Tiêu đề">
        Nội dung
      </Modal>
    );
    expect(container).toBeEmptyDOMElement();
  });

  it("render nội dung, title, children nếu isOpen=true", () => {
    render(
      <Modal isOpen={true} onClose={() => {}} title="Tiêu đề Test">
        <div data-testid="content">Nội dung test</div>
      </Modal>
    );
    expect(screen.getByText("Tiêu đề Test")).toBeInTheDocument();
    expect(screen.getByTestId("content")).toHaveTextContent("Nội dung test");
    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  it("gọi onClose khi bấm nút đóng", () => {
    const onClose = vi.fn();
    render(
      <Modal isOpen={true} onClose={onClose} title="Đóng test">
        Nội dung
      </Modal>
    );
    fireEvent.click(screen.getByRole("button"));
    expect(onClose).toHaveBeenCalled();
  });

  it("có class overlay và modal đúng", () => {
    render(
      <Modal isOpen={true} onClose={() => {}} title="Class test">
        Nội dung
      </Modal>
    );
    // Overlay
    expect(screen.getByText("Class test").closest(".fixed")).toBeTruthy();
    // Modal content
    expect(screen.getByText("Class test").closest(".bg-white")).toBeTruthy();
  });
});
