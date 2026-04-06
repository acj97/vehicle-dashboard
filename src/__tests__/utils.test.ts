import { cn } from "@/lib/utils";

describe("cn()", () => {
  it("returns a single class unchanged", () => {
    expect(cn("foo")).toBe("foo");
  });

  it("joins multiple classes", () => {
    expect(cn("foo", "bar")).toBe("foo bar");
  });

  it("ignores falsy values", () => {
    expect(cn("foo", false, undefined, null, "bar")).toBe("foo bar");
  });

  it("handles conditional objects", () => {
    expect(cn("base", { active: true, disabled: false })).toBe("base active");
  });

  it("merges conflicting Tailwind classes — last one wins", () => {
    expect(cn("p-4", "p-6")).toBe("p-6");
  });

  it("merges conflicting text colors", () => {
    expect(cn("text-red-500", "text-blue-500")).toBe("text-blue-500");
  });

  it("preserves non-conflicting classes", () => {
    expect(cn("text-sm", "font-bold")).toBe("text-sm font-bold");
  });
});
