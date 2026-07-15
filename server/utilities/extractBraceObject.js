import JSON5 from "json5";

/**
 * Extracts the first object enclosed in braces from a string and parses it as 
 * JSON5. Used for extracting data from gemini error messages.
 */
export const extractBraceObject = (errorText) => {
  const start = errorText.indexOf("{");
  if (start === -1) return null;

  let depth = 0;
  let end = -1;

  for (let i = start; i < errorText.length; i++) {
    if (errorText[i] === "{") depth++;
    if (errorText[i] === "}") {
      depth--;
      if (depth === 0) {
        end = i;
        break;
      }
    }
  }

  if (end === -1) return null;

  const objectText = errorText.slice(start, end + 1);
  return JSON5.parse(objectText);
}