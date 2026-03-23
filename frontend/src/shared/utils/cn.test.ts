import { cn } from "./cn";

describe("Utilitário cn", () => {
  it("deve unir classes do Tailwind corretamente", () => {
    expect(cn("px-2 py-1", "p-4")).toBe("p-4");
  });

  it("deve compor classes corretas condicionalmente e lidar com conflitos do Tailwind", () => {
    expect(cn("bg-red-500", { "bg-blue-500": true })).toBe("bg-blue-500");
  });
});
