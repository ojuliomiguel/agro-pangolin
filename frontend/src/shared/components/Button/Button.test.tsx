import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import { Button } from "./Button";

describe("Botão", () => {
  it("deve renderizar corretamente com o texto passado no children", () => {
    render(<Button>Clique Aqui</Button>);
    expect(screen.getByRole("button", { name: /clique aqui/i })).toBeInTheDocument();
  });

  it("deve aplicar a variante outline", () => {
    render(<Button variant="outline">Outline</Button>);
    const button = screen.getByRole("button", { name: /outline/i });
    expect(button).toHaveClass("border");
    expect(button).toHaveClass("bg-white");
  });

  it("deve chamar a função ao clicar", () => {
    const defaultProps = { onClick: jest.fn() };
    render(<Button {...defaultProps}>Click</Button>);
    fireEvent.click(screen.getByRole("button"));
    expect(defaultProps.onClick).toHaveBeenCalledTimes(1);
  });

  it("não deve chamar a função de clique se estiver desabilitado", () => {
    const fn = jest.fn();
    render(<Button onClick={fn} disabled>Click</Button>);
    fireEvent.click(screen.getByRole("button"));
    expect(fn).not.toHaveBeenCalled();
    expect(screen.getByRole("button")).toBeDisabled();
  });
});
