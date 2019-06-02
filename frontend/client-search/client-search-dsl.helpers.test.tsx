import { parseSearch, serializeSearch } from "./client-search-dsl.helpers";

describe(`client-search-dsl.helpers`, () => {
  describe(`parseSearch`, () => {
    it(`works with just searching name`, () => {
      const result = parseSearch("Freddie Mercury");
      expect(result.isValid).toBe(true);
      expect(result.errors).toEqual([]);
      expect(result.parse.name).toBe("Freddie Mercury");
    });

    it(`can parse a string with name and zip code`, () => {
      const result = parseSearch("Freddie Mercury zip:84109");
      expect(result.isValid).toBe(true);
      expect(result.errors).toEqual([]);
      expect(result.parse.name).toBe("Freddie Mercury");
      expect(result.parse.zip).toBe("84109");
    });

    it(`can parse just a zip code`, () => {
      const result = parseSearch("zip:84095");
      expect(result.isValid).toBe(true);
      expect(result.errors).toEqual([]);
      expect(result.parse.name).toBeUndefined();
      expect(result.parse.zip).toBe("84095");
    });

    it(`can parse a split up name`, () => {
      const result = parseSearch("Freddie zip:84095 Mercury");
      expect(result.isValid).toBe(true);
      expect(result.errors).toEqual([]);
      expect(result.parse.name).toBe("Freddie Mercury");
      expect(result.parse.zip).toBe("84095");
    });
  });

  describe(`serializeSearch`, () => {
    it(`can serialize just a name`, () => {
      expect(serializeSearch({ name: "Freddie Mercury" })).toEqual(
        "Freddie Mercury"
      );
    });

    it(`can serialize a name and a zip code`, () => {
      expect(
        serializeSearch({ name: "Freddie Mercury", zip: "84109" })
      ).toEqual("Freddie Mercury zip:84109");
    });

    it(`can serialize just a zip code`, () => {
      expect(serializeSearch({ zip: "84109" })).toEqual("zip:84109");
    });
  });
});
