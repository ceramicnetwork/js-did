import type { Opaque } from "ts-essentials";
import { uri } from "./uri.js";
import { left, right } from "codeco";
import { match, literal, seq, map, option, foldMap, sepBy, type Combinator } from "codeco/linear";
import { domain } from "./domain.js";

const LF = literal("\n");
const DIGITS = match(/^\d+/);

const network = match(/^\w+/);

const wantLine = seq(domain, literal(" wants you to sign in with your "), network, literal(" account:"));
export const wantClause = map(wantLine, (line) => {
  return {
    domain: line[0],
    network: line[2],
  };
});

export const address = match(/^\w+/);

export const statementLine = match(/^[^\n]+/);
// ABNF: [statement LF]
const statementClause = map(option(seq(statementLine, LF), undefined), (parsed) => {
  if (!parsed) return undefined;
  return parsed[0];
});

export const uriClause = map(seq(literal("URI: "), uri, LF), (line) => line[1]);

export const versionClause = map(seq(literal("Version: 1"), LF), () => "1");

export const chainIdClause = map(seq(literal("Chain ID: "), DIGITS, LF), (line) => line[1]);

export const nonce = match(/^[a-zA-Z0-9]{8,}/);
export const nonceClause = map(seq(literal("Nonce: "), nonce, LF), (line) => line[1]);

export type DateTimeString = Opaque<string, "date-time">;
const dateTimeMatch = match(/\d\d\d\d-\d\d-\d\dT\d\d:\d\d:\d\d(\.\d+)?(Z|([+-](\d\d):(\d\d)))/);
export const dateTime: Combinator<DateTimeString, string> = foldMap(dateTimeMatch, (input) => {
  const isDate = Number.isFinite(Date.parse(input));
  if (isDate) {
    return right(input as DateTimeString);
  } else {
    return left(new Error(`Invalid date-time ${input}`));
  }
});

const dateTimeClause = (name: string) => {
  return map(seq(literal(name), dateTime), (line) => line[1]);
};

export const issuedAtClause = dateTimeClause("Issued At: ");
export const expirationTimeClause = dateTimeClause("Expiration Time: ");
export const notBeforeClause = dateTimeClause("Not Before: ");

// unreserved    = ALPHA / DIGIT / "-" / "." / "_" / "~"
// pct-encoded   = "%" HEXDIG HEXDIG
// sub-delims    = "!" / "$" / "&" / "'" / "(" / ")"
// pchar         = unreserved / pct-encoded / sub-delims / ":" / "@"
// like userinfo, but with "@"
// anyPchar = *pchar
export const anyPchar = match(/^([a-zA-Z0-9-._~!$&'():@]|(%[a-fA-F0-9]{2}))*/);

const requestIdLine = seq(literal("Request ID: "), anyPchar, LF);
export const requestIdClause = map(requestIdLine, (line) => line[1]);

const resource = uri;
const resourceLine = seq(literal("- "), resource);
const resourceClause = map(resourceLine, (line) => line[1]);
const resourcesSection = seq(literal("Resources:"), LF, option(sepBy(resourceClause, LF), []));
export const resourcesClause = map(resourcesSection, (section) => section[2]);

// want + address
const header = seq(wantClause, LF, address, LF);
const headerClause = map(header, (h) => {
  return {
    domain: h[0].domain,
    network: h[0].network,
    address: h[2],
  };
});

const mandatoryFields = map(
  seq(uriClause, versionClause, chainIdClause, nonceClause, issuedAtClause),
  (clauses) => {
    return {
      uri: clauses[0],
      version: clauses[1],
      chainId: clauses[2],
      nonce: clauses[3],
      issuedAt: clauses[4],
    };
  }
);

const optionalExpirationTime = option(seq(LF, expirationTimeClause), undefined);
const optionalNotBefore = option(seq(LF, notBeforeClause), undefined);
const optionalRequestId = option(seq(LF, requestIdClause), undefined);
const optionalResources = map(option(seq(LF, resourcesClause), undefined), (line) => {
  if (line) return line[1];
});
const optionalFields = map(
  seq(optionalExpirationTime, optionalNotBefore, optionalRequestId, optionalResources),
  (fields) => {
    return {
      expirationTime: fields[0],
      notBefore: fields[1],
      requestId: fields[2],
      resources: fields[3],
    };
  }
);

const siwxMessageRaw = seq(headerClause, LF, statementClause, LF, mandatoryFields, optionalFields);
export const siwxMessage = map(siwxMessageRaw, (result) => {
  const header = result[0];
  const statement = result[2];
  const mandatory = result[4];
  const optional = result[5];
  return {
    domain: header.domain,
    network: header.network,
    address: header.address,
    statement: statement,
    uri: mandatory.uri,
    version: mandatory.version,
    chainId: mandatory.chainId,
    nonce: mandatory.nonce,
    issuedAt: mandatory.issuedAt,
    resources: optional.resources,
  };
});
