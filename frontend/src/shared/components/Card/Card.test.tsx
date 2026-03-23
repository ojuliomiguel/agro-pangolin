import "@testing-library/jest-dom"
import { render, screen } from "@testing-library/react"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "./Card"

describe("Componente Card", () => {
  it("deve renderizar toda a estrutura do Card", () => {
    render(
      <Card data-testid="card">
        <CardHeader>
          <CardTitle>Título do Card</CardTitle>
          <CardDescription>Descrição do Card</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Conteúdo Aqui</p>
        </CardContent>
        <CardFooter>
          <button>Ação</button>
        </CardFooter>
      </Card>
    )

    expect(screen.getByTestId("card")).toBeInTheDocument()
    expect(screen.getByText("Título do Card")).toBeInTheDocument()
    expect(screen.getByText("Descrição do Card")).toBeInTheDocument()
    expect(screen.getByText("Conteúdo Aqui")).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "Ação" })).toBeInTheDocument()
  })

  it("deve repassar a className extra para os componentes base", () => {
    render(<Card data-testid="card-extra" className="minha-classe-custom" />)
    expect(screen.getByTestId("card-extra")).toHaveClass("minha-classe-custom")
  })
})
