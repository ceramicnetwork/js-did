import type { Opaque } from "ts-essentials";
import { choice, foldMap, literal, match, option, joinSeq, type Combinator } from "codeco/linear";
import { left, right } from "codeco";
import { ipLiteral, ipv4Address } from "./ip-address.js";

export const port: Combinator<string, string> = foldMap(match(/^\d+/), (digits) => {
  if (String(parseInt(digits, 10)) === digits) return right(digits);
  return left(new Error(`Invalid port ${digits}`));
});

/**
 * ABNF:
 * ```
 * reg-name      = *( unreserved / pct-encoded / sub-delims )
 * unreserved    = ALPHA / DIGIT / "-" / "." / "_" / "~"
 * pct-encoded   = "%" HEXDIG HEXDIG
 * sub-delims    = "!" / "$" / "&" / "'" / "(" / ")" / "*" / "+" / "," / ";" / "="
 * ```
 */
export const regName = match(/^([a-zA-Z0-9\-._~!$&'()*+,;=]|(%[a-fA-F0-9]{2}))*/);

export const host = choice(ipLiteral, ipv4Address, regName);

/**
 * `dnsauthority    = host [ ":" port ]`
 */
const colonPort = joinSeq(literal(":"), port);
export const dnsauthority = joinSeq(host, option(colonPort, ""));

/**
 * Custom SIWE domain. `dnsauthority` that can not be empty.
 */
export type DomainString = Opaque<string, "domain">;
export const domain: Combinator<DomainString, string> = foldMap(dnsauthority, (found) => {
  if (!found) return left(new Error(`domain can not be empty`));
  return right(found as DomainString);
});
