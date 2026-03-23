import "@testing-library/jest-dom"
import { render, screen } from "@testing-library/react"
import { Skeleton } from "./Skeleton"

describe("Skeleton", () => {
  it("deve renderizar o esqueleto corretamente", () => {
    render(<Skeleton />)
    expect(screen.getByTestId("skeleton")).toHaveClass("animate-pulse")
  })

  it("deve aplicar classes personalizadas", () => {
    render(<Skeleton className="w-10 h-10" />)
    expect(screen.getByTestId("skeleton")).toHaveClass("w-10 h-10")
  })
})
