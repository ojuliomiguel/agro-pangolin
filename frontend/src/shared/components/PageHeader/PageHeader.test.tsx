import "@testing-library/jest-dom"
import { render, screen } from "@testing-library/react"
import { PageHeader } from "./PageHeader"
import { Button } from "../Button/Button"

describe("PageHeader Component", () => {
  it("deve exibir o titulo principal", () => {
    render(<PageHeader title="Meu Titulo" />)
    expect(screen.getByText("Meu Titulo")).toBeInTheDocument()
  })

  it("deve exibir descrição quando informada", () => {
    render(<PageHeader title="Titulo" description="Descrição teste" />)
    expect(screen.getByText("Descrição teste")).toBeInTheDocument()
  })

  it("deve renderizar acoes filhas", () => {
    render(
      <PageHeader title="Ações">
        <Button>Salvar</Button>
      </PageHeader>
    )
    expect(screen.getByRole("button", { name: "Salvar" })).toBeInTheDocument()
  })
})
