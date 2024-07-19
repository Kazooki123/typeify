// asyncAnnotator.test.ts

import { addAsyncReturnTypes } from "../../src/utils/asyncAnnotator";

describe("asyncAnnotator", () => {
  test("adds Promise<void> return type to async function without return type", () => {
    const input = `
      async function test() {
        console.log('Hello');
      }
    `;
    const expected = `
      async function test(): Promise<void> {
        console.log('Hello');
      }
    `;
    expect(addAsyncReturnTypes(input).replace(/\s+/g, "")).toBe(
      expected.replace(/\s+/g, "")
    );
  });

  test("wraps existing return type in Promise for async function", () => {
    const input = `
      async function getData(): string {
        return 'data';
      }
    `;
    const expected = `
      async function getData(): Promise<string> {
        return 'data';
      }
    `;
    expect(addAsyncReturnTypes(input).replace(/\s+/g, "")).toBe(
      expected.replace(/\s+/g, "")
    );
  });

  test("adds Promise<void> return type to async arrow function", () => {
    const input = `
      const test = async () => {
        console.log('Hello');
      };
    `;
    const expected = `
      const test = async (): Promise<void> => {
        console.log('Hello');
      };
    `;
    expect(addAsyncReturnTypes(input).replace(/\s+/g, "")).toBe(
      expected.replace(/\s+/g, "")
    );
  });

  test("adds Promise<void> return type to async method", () => {
    const input = `
      class Test {
        async method() {
          console.log('Hello');
        }
      }
    `;
    const expected = `
      class Test {
        async method(): Promise<void> {
          console.log('Hello');
        }
      }
    `;
    expect(addAsyncReturnTypes(input).replace(/\s+/g, "")).toBe(
      expected.replace(/\s+/g, "")
    );
  });

  test("does not modify non-async functions", () => {
    const input = `
      function test() {
        console.log('Hello');
      }
    `;
    expect(addAsyncReturnTypes(input).replace(/\s+/g, "")).toBe(
      input.replace(/\s+/g, "")
    );
  });

  test("does not modify async functions that already return Promise", () => {
    const input = `
      async function test(): Promise<string> {
        return 'Hello';
      }
    `;
    expect(addAsyncReturnTypes(input).replace(/\s+/g, "")).toBe(
      input.replace(/\s+/g, "")
    );
  });
});
