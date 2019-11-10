import queryString from "query-string";

export let allowedSearchFields = {};

let allowedKeys = Object.keys(allowedSearchFields);

export function setAllowedSearchFields(searchFields) {
  allowedSearchFields = { ...searchFields };
  allowedKeys = Object.keys(allowedSearchFields);
}

export function parseSearch(
  value: string,
  forcedValues: SearchParseValues = {}
): SearchParse {
  if (value.startsWith("?")) {
    value = value.slice(1);
  }
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

    console.log("parseSearch:");
    console.log("value string");
    console.log(value);
    console.log("result");
    console.log(result);

    return result;
  }, initialParsedValue);

  Object.assign(parse, forcedValues);

  Object.keys(parse).forEach(key => {
    if (!parse[key]) {
      delete parse[key];
    }
  });

  return {
    isValid: errors.length === 0,
    errors,
    parse
  };
}

export function serializeSearch(parse: SearchParseValues): string {
  return Object.keys(parse)
    .reduce((acc, key) => {
      if (allowedKeys.includes(key) && parse[key]) {
        return `${acc} ${key}:${parse[key]}`;
      } else {
        return acc;
      }
    }, parse.name || "")
    .trim();
}

export function deserializeSearch(
  queryParamString: string = window.location.search
): string {
  const params = queryString.parse(queryParamString);
  const relevantParams = Object.keys(params).reduce((acc, key) => {
    if (allowedKeys.includes(key)) {
      acc.push(`${key}:${params[key]}`);
    }
    return acc;
  }, []);

  return `${params.name || ""} ${relevantParams.join(" ")}`.trim();
}

export type SearchParse = {
  isValid: boolean;
  errors: string[];
  parse: SearchParseValues;
};

export type SearchParseValues = {
  name?: string;
  zip?: string;
  phone?: string;
  id?: string;
  event?: string;
};
