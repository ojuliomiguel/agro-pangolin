import { Area } from "./area";

describe("Area", () => {
  it("deve criar com valor positivo", () => {
    const area = Area.create(100.5);
    expect(area.value).toBe(100.5);
  });

  it("deve criar com zero (área vazia é permitida)", () => {
    const area = Area.create(0);
    expect(area.value).toBe(0);
  });

  it("deve lançar erro para valor negativo", () => {
    expect(() => Area.create(-1)).toThrow("não pode ser negativo");
  });

  it("deve somar duas áreas corretamente", () => {
    const a = Area.create(30);
    const b = Area.create(20);
    expect(a.add(b).value).toBe(50);
  });

  it("deve comparar áreas com isLessThanOrEqualTo", () => {
    const smaller = Area.create(50);
    const bigger = Area.create(100);
    expect(smaller.isLessThanOrEqualTo(bigger)).toBe(true);
    expect(bigger.isLessThanOrEqualTo(smaller)).toBe(false);
    expect(smaller.isLessThanOrEqualTo(Area.create(50))).toBe(true);
  });

  it("deve retornar equals corretamente", () => {
    expect(Area.create(42).equals(Area.create(42))).toBe(true);
    expect(Area.create(42).equals(Area.create(43))).toBe(false);
  });
});
