import "@testing-library/jest-dom"
import { render, screen } from "@testing-library/react"
import { EmptyState } from "./EmptyState"
import { Search } from "lucide-react"
import { Button } from "../Button/Button"

describe("EmptyState Component", () => {
  it("deve renderizar apenas com titulo", () => {
    render(<EmptyState title="Nenhum resultado" />)
    expect(screen.getByText("Nenhum resultado")).toBeInTheDocument()
  })

  it("deve renderizar descricao e botao filhos", () => {
    render(
      <EmptyState title="Vazio" description="Sem itens aqui">
        <Button>Criar item</Button>
      </EmptyState>
    )
    expect(screen.getByText("Sem itens aqui")).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "Criar item" })).toBeInTheDocument()
  })

  it("nao deve quebrar se passar um icone", () => {
    render(<EmptyState title="Com Icon" icon={Search} />)
    expect(screen.getByTestId("empty-state")).toBeInTheDocument()
  })
})
