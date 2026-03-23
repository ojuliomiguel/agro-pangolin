import "@testing-library/jest-dom"
import { render, screen } from "@testing-library/react"
import { PageHeader } from "./PageHeader"
import { Button } from "../Button/Button"

describe("Componente PageHeader", () => {
  it("deve exibir o título principal", () => {
    render(<PageHeader title="Meu Titulo" />)
    expect(screen.getByText("Meu Titulo")).toBeInTheDocument()
  })

  it("deve exibir a descrição quando informada", () => {
    render(<PageHeader title="Titulo" description="Descrição teste" />)
    expect(screen.getByText("Descrição teste")).toBeInTheDocument()
  })

  it("deve renderizar ações filhas", () => {
    render(
      <PageHeader title="Ações">
        <Button>Salvar</Button>
      </PageHeader>
    )
    expect(screen.getByRole("button", { name: "Salvar" })).toBeInTheDocument()
  })
})
