import { test } from "uvu";
import {
  address,
  chainIdClause,
  issuedAtClause,
  nonceClause,
  requestIdClause,
  resourcesClause,
  siwxMessage,
  statementLine,
  uriClause,
  versionClause,
  wantClause,
} from "./siwx-message.js";
import { assertNotParse, assertParse } from "../__tests__/assertions.util.js";
import * as assert from "uvu/assert";
import { isRight } from "codeco";
import { StringTape} from 'codeco/linear'

test("wantClause", () => {
  const domain = "service.invalid wants you to sign in with your Ethereum account:";
  assertParse(domain, wantClause, { domain: "service.invalid", network: "Ethereum" });

  const userIp = "test@127.0.0.1 wants you to sign in with your Ethereum account:";
  assertNotParse(userIp, wantClause);
});

test("address", () => {
  assertParse("0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2", address);
});

test("statement", () => {
  const input = "I accept the ServiceOrg Terms of Service: https://service.invalid/tos";
  assertParse(input, statementLine);

  assertParse("foo\n\n", statementLine, "foo");
});

test("URI", () => {
  const input = "URI: https://service.invalid/login\n";
  assertParse(input, uriClause, "https://service.invalid/login");

  const withNewline = "URI: https://service.invalid/login\n\n";
  assertParse(withNewline, uriClause, "https://service.invalid/login");

  // Stop before LF symbols
  const tape = new StringTape(withNewline);
  const parsed = uriClause(tape);
  assert.ok(isRight(parsed));
  assert.equal(tape.position, withNewline.length - 1);
});

test("Version", () => {
  assertParse("Version: 1\n", versionClause, "1");
  assertNotParse("Version: 0\n", versionClause);
});

test("Chain ID", () => {
  assertParse("Chain ID: 1\n", chainIdClause, "1");
  assertParse("Chain ID: 345\n", chainIdClause, "345");
});

test("Nonce", () => {
  assertParse("Nonce: 12345678\n", nonceClause, "12345678");
  assertParse("Nonce: 123456a78bcasd911111\n", nonceClause, "123456a78bcasd911111");
  assertNotParse("Nonce: 1234567\n", nonceClause);
  assertNotParse("Nonce: 1234-5678\n", nonceClause);
});

test("Issued At", () => {
  assertParse("Issued At: 2021-09-30T16:25:24Z\n", issuedAtClause, "2021-09-30T16:25:24Z");
  assertParse("Issued At: 2021-09-30T16:25:24+03:00\n", issuedAtClause, "2021-09-30T16:25:24+03:00");
});

test("Request ID", () => {
  assertParse("Request ID: a\n", requestIdClause, "a");
  assertParse("Request ID: \n", requestIdClause, ""); // Formally correct
  assertNotParse("Request ID:\n", requestIdClause);
});

test("Resources", () => {
  const a = `Resources:\n- ipfs://bafybeiemxf5abjwjbikoz4mc3a3dla6ual3jsgpdr4cjr3oz3evfyavhwq\n- https://example.com/my-web2-claim.json`;
  assertParse(a, resourcesClause, [
    "ipfs://bafybeiemxf5abjwjbikoz4mc3a3dla6ual3jsgpdr4cjr3oz3evfyavhwq",
    "https://example.com/my-web2-claim.json",
  ]);
});

test("full message", () => {
  const noResources =
    "service.invalid wants you to sign in with your Ethereum account:\n0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2\n\nI accept the ServiceOrg Terms of Service: https://service.invalid/tos\n\nURI: https://service.invalid/login\nVersion: 1\nChain ID: 1\nNonce: 32891756\nIssued At: 2021-09-30T16:25:24Z";
  const parsed = siwxMessage(new StringTape(noResources));
  assert.ok(isRight(parsed));
  const fields = parsed.right;
  assert.equal(fields.domain, "service.invalid");
  assert.equal(fields.network, "Ethereum");
  assert.equal(fields.address, "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2");
  assert.equal(fields.statement, "I accept the ServiceOrg Terms of Service: https://service.invalid/tos");
  assert.equal(fields.uri, "https://service.invalid/login");
  assert.equal(fields.version, "1");
  assert.equal(fields.chainId, "1");
  assert.equal(fields.nonce, "32891756");
  assert.equal(fields.issuedAt, "2021-09-30T16:25:24Z");
});

test.run();
