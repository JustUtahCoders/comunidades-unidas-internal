import {
  parseSearch,
  serializeSearch,
  deserializeSearch
} from "./search-dsl.helpers";

describe(`client-search-dsl.helpers`, () => {
  describe(`parseSearch`, () => {
    it(`works with just searching name`, () => {
      const result = parseSearch(
        {
          id: "Lead ID",
          zip: "ZIP Code",
          phone: "Phone",
          program: "Interest in Program",
          event: "Event Attended"
        },
        "Freddie Mercury"
      );
      expect(result.isValid).toBe(true);
      expect(result.errors).toEqual([]);
      expect(result.parse.name).toBe("Freddie Mercury");
    });

    // FIXME - returning false
    // it(`can parse a string with name and zip code`, () => {
    //   const result = parseSearch("Freddie Mercury zip:84109");
    //   expect(result.isValid).toBe(true);
    //   expect(result.errors).toEqual([]);
    //   expect(result.parse.name).toBe("Freddie Mercury");
    //   expect(result.parse.zip).toBe("84109");
    // });

    // FIXME - returning false
    // it(`can parse just a zip code`, () => {
    //   const result = parseSearch("zip:84095");
    //   expect(result.isValid).toBe(true);
    //   expect(result.errors).toEqual([]);
    //   expect(result.parse.name).toBeUndefined();
    //   expect(result.parse.zip).toBe("84095");
    // });

    // FIXME - returning false
    // it(`can parse a split up name`, () => {
    //   const result = parseSearch("Freddie zip:84095 Mercury");
    //   expect(result.isValid).toBe(true);
    //   expect(result.errors).toEqual([]);
    //   expect(result.parse.name).toBe("Freddie Mercury");
    //   expect(result.parse.zip).toBe("84095");
    // });

    // FIXME - returning false
    // it(`can parse a zip, phone, name, and id`, () => {
    //   const result = parseSearch(
    //     "Freddie Mercury zip:84095 phone:1234567890 id:12"
    //   );
    //   expect(result.isValid).toBe(true);
    //   expect(result.errors).toEqual([]);
    //   expect(result.parse.name).toBe("Freddie Mercury");
    //   expect(result.parse.zip).toBe("84095");
    //   expect(result.parse.phone).toBe("1234567890");
    //   expect(result.parse.id).toBe("12");
    // });

    // FIXME - returning false
    // it(`can parse a string and force certain values`, () => {
    //   const result = parseSearch("Yoshi zip:84103", { id: "7" });
    //   expect(result.isValid).toBe(true);
    //   expect(result.errors).toEqual([]);
    //   expect(result.parse.name).toBe("Yoshi");
    //   expect(result.parse.zip).toBe("84103");
    //   expect(result.parse.id).toBe("7");
    // });

    it(`omits empty forced values from the parse`, () => {
      const result = parseSearch(
        {
          id: "Lead ID",
          zip: "ZIP Code",
          phone: "Phone",
          program: "Interest in Program",
          event: "Event Attended"
        },
        "Yoshi",
        { id: "" }
      );
      expect(result.isValid).toBe(true);
      expect(result.errors).toEqual([]);
      expect(result.parse.name).toBe("Yoshi");
      expect(result.parse.id).not.toBeDefined();
    });
  });

  describe(`serializeSearch`, () => {
    it(`can serialize just a name`, () => {
      expect(
        serializeSearch(
          {
            id: "Lead ID",
            zip: "ZIP Code",
            phone: "Phone",
            program: "Interest in Program",
            event: "Event Attended"
          },
          {
            name: "Freddie Mercury"
          }
        )
      ).toEqual("Freddie Mercury");
    });

    // FIXME - returning false
    // it(`can serialize a name and a zip code`, () => {
    //   expect(
    //     serializeSearch({ name: "Freddie Mercury", zip: "84109" })
    //   ).toEqual("Freddie Mercury zip:84109");
    // });

    // FIXME - returning false
    // it(`can serialize just a zip code`, () => {
    //   expect(serializeSearch({ zip: "84109" })).toEqual("zip:84109");
    // });
  });

  describe(`deserializeSearch`, () => {
    it(`can deserialize just a name`, () => {
      expect(
        deserializeSearch(
          {
            id: "Lead ID",
            zip: "ZIP Code",
            phone: "Phone",
            program: "Interest in Program",
            event: "Event Attended"
          },
          "?name=hello there"
        )
      ).toEqual("hello there");
    });

    // FIXME - returning false
    // it(`can deserialize a name and zip`, () => {
    //   expect(deserializeSearch("?name=super&zip=boom")).toEqual(
    //     "super zip:boom"
    //   );
    // });

    // FIXME - returning false
    // it(`can deserialize just a zip`, () => {
    //   expect(deserializeSearch("?zip=isai")).toEqual("zip:isai");
    // });
  });
});
