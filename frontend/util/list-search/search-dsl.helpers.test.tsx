import {
  parseSearch,
  serializeSearch,
  deserializeSearch
} from "./search-dsl.helpers";

describe(`client-search-dsl.helpers`, () => {
  describe(`parseSearch`, () => {
    it(`works with just searching name`, () => {
      const result = parseSearch("Freddie Mercury");
      expect(result.isValid).toBe(true);
      expect(result.errors).toEqual([]);
      expect(result.parse.name).toBe("Freddie Mercury");
    });
  });
});
