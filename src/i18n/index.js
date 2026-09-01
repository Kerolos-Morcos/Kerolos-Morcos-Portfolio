import ar from "./ar";
import en from "./en";

export const locales = { ar, en };
export function translate(locale, path) {
  return path.split(".").reduce((value, key) => value?.[key], locales[locale]);
}
