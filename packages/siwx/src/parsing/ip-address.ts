import { choice, join, joinSeq, literal, many, match, option, sepBy, seq, type Combinator } from "codeco/linear";

const DOT = literal(".");
const COLON = literal(":");
const DCOLON = literal("::");

/**
 * `h16 = 1*4HEXDIG`
 */
export const h16 = match(/^([0-9a-fA-F]{2}){1,4}/);

/**
 * ABNF:
 * ```
 * dec-octet     = DIGIT                 ; 0-9
 *                  / %x31-39 DIGIT         ; 10-99
 *                  / "1" 2DIGIT            ; 100-199
 *                  / "2" %x30-34 DIGIT     ; 200-249
 *                  / "25" %x30-35          ; 250-255
 * ```
 */
export const decOctet = match(/^(25[0-5])|(2[0-4]\d)|(1\d\d)|([1-9]\d)|(\d)/);

/**
 * ABNF:
 * ```
 * IPv4address   = dec-octet "." dec-octet "." dec-octet "." dec-octet
 * dec-octet     = DIGIT                 ; 0-9
 *                  / %x31-39 DIGIT         ; 10-99
 *                  / "1" 2DIGIT            ; 100-199
 *                  / "2" %x30-34 DIGIT     ; 200-249
 *                  / "25" %x30-35          ; 250-255
 * ```
 */
export const ipv4Address = joinSeq(decOctet, DOT, decOctet, DOT, decOctet, DOT, decOctet);

/**
 * `ls32          = ( h16 ":" h16 ) / IPv4address`
 */
export const ls32 = choice(joinSeq(h16, COLON, h16), ipv4Address);

function makeIPv6Address(): Combinator<string, string> {
  // Single h16:: element, repeated N times
  const singlet = (repeat: number) => join(many(joinSeq(h16, COLON), repeat, repeat));
  const leftPart = (max: number) => option(join(sepBy(h16, COLON, 1, max), ":"), ""); // Left to :: symbol
  const a = seq(singlet(6), ls32); // 6
  const b = seq(DCOLON, singlet(5), ls32); // ::5
  const c = seq(leftPart(1), DCOLON, singlet(4), ls32); // [0-1]::4
  const d = seq(leftPart(2), DCOLON, singlet(3), ls32); // [1-2]::3
  const e = seq(leftPart(3), DCOLON, singlet(2), ls32); // [1-3]::2
  const f = seq(leftPart(4), DCOLON, singlet(1), ls32); // [1-4]::1
  const g = seq(leftPart(5), DCOLON, ls32); // [1-5]::0 ls32
  const h = seq(leftPart(6), DCOLON, h16); // [1-6]::0 h16
  const i = seq(leftPart(7), DCOLON); // [1-7]::0\end
  return join(choice(a, b, c, d, e, f, g, h, i));
}

export const ipv6address = makeIPv6Address();

// IP-literal    = "[" ( IPv6address / IPvFuture  ) "]"
export const ipLiteral = joinSeq(literal("["), ipv6address, literal("]"));
