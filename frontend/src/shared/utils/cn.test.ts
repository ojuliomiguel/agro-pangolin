import { cn } from "./cn";

describe("cn utility", () => {
  it("deve unir (merge) classes do Tailwind corretamente", () => {
    expect(cn("px-2 py-1", "p-4")).toBe("p-4");
  });

  it("deve compor condicionalmente classes corretas e lidar com conflitos do Tailwind", () => {
    // bg-blue-500 substitui o bg-red-500 pelo funcionamento do twMerge.
    expect(cn("bg-red-500", { "bg-blue-500": true })).toBe("bg-blue-500");
  });
});
