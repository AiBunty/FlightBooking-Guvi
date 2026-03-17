import { describe, expect, it } from "vitest";
import { generateBookingReference } from "@/lib/utils";

describe("booking service helpers", () => {
  it("generates booking references", () => {
    const ref = generateBookingReference();
    expect(ref).toHaveLength(6);
  });
});
