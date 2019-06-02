const allowedKeys = ["zip"];

export function parseSearch(value: string): SearchParse {
  const tokens = value.split(/\s/);
  let nameFound = false;
  let errors = [];

  const initialParsedValue: SearchParseValues = {};

  const parse = tokens.reduce((result, token) => {
    if (token.includes(":")) {
      const [key, value] = token.split(":");
      if (allowedKeys.includes(key)) {
        result[key] = value;
      } else {
        errors.push(
          `Unknown search key '${key}'. Valid search keys are '${allowedKeys.join(
            ", "
          )}'`
        );
      }
    } else if (nameFound) {
      result.name += " " + token;
    } else {
      nameFound = true;
      result.name = token;
    }

    return result;
  }, initialParsedValue);

  return {
    isValid: errors.length === 0,
    errors,
    parse
  };
}

export function serializeSearch(parse: SearchParseValues): string {
  return Object.keys(parse)
    .reduce((acc, key) => {
      if (allowedKeys.includes(key)) {
        return `${acc} ${key}:${parse[key]}`;
      } else {
        return acc;
      }
    }, parse.name || "")
    .trim();
}

export type SearchParse = {
  isValid: boolean;
  errors: string[];
  parse: SearchParseValues;
};

export type SearchParseValues = {
  name?: string;
  zip?: string;
};
