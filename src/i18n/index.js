import ar from "./ar";
import en from "./en";
import { v2Ar, v2En } from "./v2";

export const locales = { ar: { ...ar, v2: v2Ar }, en: { ...en, v2: v2En } };
export function translate(locale, path) {
  return path.split(".").reduce((value, key) => value?.[key], locales[locale]);
}
