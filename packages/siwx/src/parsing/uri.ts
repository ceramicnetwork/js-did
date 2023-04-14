import { foldMap, match, type Combinator } from "codeco/linear";
import { left, right } from "codeco";
import type { Opaque } from "ts-essentials";

export type URIString = Opaque<string, "URI">;
/**
 * Parse URI by checking if string could be parsed by `new URL`
 */
export const uri: Combinator<URIString, string> = foldMap(match(/^\S+/), (s) => {
  try {
    new URL(s);
    return right(s as URIString);
  } catch (e) {
    return left(new Error(`Invalid URI ${s}`));
  }
});
