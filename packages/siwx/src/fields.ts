import type { Opaque } from "ts-essentials";
import { domain, type DomainString } from "./parsing/domain.js";
import { dateTime, type DateTimeString, nonce } from "./parsing/siwx-message.js";
import { uri, type URIString } from "./parsing/uri.js";
import { StringTape, parseAll, type Combinator } from "codeco/linear";
import { getOrThrow } from "codeco";

export function toField<T>(combinator: Combinator<T, string>) {
  const parser = parseAll(combinator);
  return function (input: string): T {
    return getOrThrow(parser(new StringTape(input)));
  };
}

export type { DomainString } from "./parsing/domain.js";
export const toDomainString = toField(domain);

export type { DateTimeString } from "./parsing/siwx-message.js";
export const toDateTimeString = toField(dateTime);

export type { URIString } from "./parsing/uri.js";
export const toURIString = toField(uri);

export type NonEmptyString = Opaque<string, "non-empty">;
export function toNonEmptyString<T = NonEmptyString>(input: string, name: string): T {
  if (input) return input as T;
  throw new Error(`Expect non-empty string for "${name}" field`);
}

export type NetworkString = Opaque<string, "network">;
export type AddressString = Opaque<string, "address">;

export type VersionString = Opaque<"1", "version">;
export function toVersionString(input: string | number): VersionString {
  if (String(input) !== "1") {
    throw new Error(`Invalid version string: ${input}`);
  }
  return "1" as VersionString;
}

export type ChainIdString = Opaque<string, "chain-id">;
export function toChainIdString(input: string | number): ChainIdString {
  return String(input) as ChainIdString;
}

export type NonceString = Opaque<string, "nonce">;
export function toNonceString(input: string | number): NonceString {
  return toField(nonce)(String(input)) as NonceString;
}
