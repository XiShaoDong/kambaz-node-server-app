import { test, expect } from "@jest/globals";

function add(a, b) {
  return a + b;
}

test("adds 1 + 1", () => {
  expect(add(1, 1)).toBe(2);
});