import { StateCode } from "./state-code";

describe("StateCode", () => {
  it("deve criar com sigla válida em maiúsculo", () => {
    const state = StateCode.create("SP");
    expect(state.value).toBe("SP");
  });

  it("deve criar com sigla válida em minúsculo (normaliza para maiúsculo)", () => {
    const state = StateCode.create("sp");
    expect(state.value).toBe("SP");
  });

  it("deve criar com todas as demais siglas válidas representativas", () => {
    const valid = ["AC", "AM", "BA", "DF", "GO", "MG", "PA", "RJ", "RS", "TO"];
    valid.forEach((uf) => {
      expect(() => StateCode.create(uf)).not.toThrow();
    });
  });

  it("deve lançar erro para sigla inválida", () => {
    expect(() => StateCode.create("XX")).toThrow("Sigla de estado inválida");
  });

  it("deve lançar erro para string vazia", () => {
    expect(() => StateCode.create("")).toThrow("Sigla de estado inválida");
  });

  it("deve lançar erro para sigla inexistente no Brasil", () => {
    expect(() => StateCode.create("ZZ")).toThrow("Sigla de estado inválida");
  });

  it("deve retornar equals corretamente", () => {
    expect(StateCode.create("SP").equals(StateCode.create("SP"))).toBe(true);
    expect(StateCode.create("SP").equals(StateCode.create("RJ"))).toBe(false);
  });
});
