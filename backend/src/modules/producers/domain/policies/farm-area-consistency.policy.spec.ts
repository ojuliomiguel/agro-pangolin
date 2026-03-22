import { FarmAreaConsistencyPolicy } from "./farm-area-consistency.policy";
import { Area } from "../value-objects/area";

describe("FarmAreaConsistencyPolicy", () => {
  const makeAreas = (
    total: number,
    agricultural: number,
    vegetation: number,
  ) => ({
    totalArea: Area.create(total),
    agriculturalArea: Area.create(agricultural),
    vegetationArea: Area.create(vegetation),
  });

  it("deve aceitar quando a soma é exatamente igual à área total", () => {
    expect(() =>
      FarmAreaConsistencyPolicy.validate(makeAreas(100, 60, 40)),
    ).not.toThrow();
  });

  it("deve aceitar quando a soma é menor que a área total", () => {
    expect(() =>
      FarmAreaConsistencyPolicy.validate(makeAreas(100, 50, 30)),
    ).not.toThrow();
  });

  it("deve aceitar áreas zeradas", () => {
    expect(() =>
      FarmAreaConsistencyPolicy.validate(makeAreas(100, 0, 0)),
    ).not.toThrow();
  });

  it("deve lançar erro quando a soma ultrapassa a área total", () => {
    expect(() =>
      FarmAreaConsistencyPolicy.validate(makeAreas(100, 60, 50)),
    ).toThrow("ultrapassa a área total");
  });

  it("deve incluir os valores na mensagem de erro", () => {
    expect(() =>
      FarmAreaConsistencyPolicy.validate(makeAreas(100, 70, 50)),
    ).toThrow("120");
  });
});
