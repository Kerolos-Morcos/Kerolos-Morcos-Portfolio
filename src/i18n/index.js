import ar from "./ar";
import en from "./en";
import { v2Ar, v2En } from "./v2";
import { v3Ar, v3En } from "./v3";

export const locales = { ar: { ...ar, v2: v2Ar, v3: v3Ar }, en: { ...en, v2: v2En, v3: v3En } };
export function translate(locale, path) {
  return path.split(".").reduce((value, key) => value?.[key], locales[locale]);
}
