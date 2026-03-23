import "@testing-library/jest-dom"
import { render, screen } from "@testing-library/react"
import { EmptyState } from "./EmptyState"
import { Search } from "lucide-react"
import { Button } from "../Button/Button"

describe("Componente EmptyState", () => {
  it("deve renderizar apenas com título", () => {
    render(<EmptyState title="Nenhum resultado" />)
    expect(screen.getByText("Nenhum resultado")).toBeInTheDocument()
  })

  it("deve renderizar descrição e botão filhos", () => {
    render(
      <EmptyState title="Vazio" description="Sem itens aqui">
        <Button>Criar item</Button>
      </EmptyState>
    )
    expect(screen.getByText("Sem itens aqui")).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "Criar item" })).toBeInTheDocument()
  })

  it("não deve quebrar se passar um ícone", () => {
    render(<EmptyState title="Com Icon" icon={Search} />)
    expect(screen.getByTestId("empty-state")).toBeInTheDocument()
  })
})
