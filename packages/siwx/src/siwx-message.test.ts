import { test } from "uvu";
import * as assert from "uvu/assert";
import { SiwxMessage, SiwxMessageFields } from "./siwx-message.js";

const SHORT_MESSAGE =
  "service.invalid wants you to sign in with your Ethereum account:\n0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2\n\nI accept the ServiceOrg Terms of Service: https://service.invalid/tos\n\nURI: https://service.invalid/login\nVersion: 1\nChain ID: 1\nNonce: 32891756\nIssued At: 2021-09-30T16:25:24Z";
const WITH_RESOURCES =
  "service.org wants you to sign in with your Ethereum account:\n0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2\n\nI accept the ServiceOrg Terms of Service: https://service.org/tos\n\nURI: https://service.org/login\nVersion: 1\nChain ID: 1\nNonce: 32891757\nIssued At: 2021-09-30T16:25:24.000Z\nResources:\n- ipfs://Qme7ss3ARVgxv6rXqVPiikMJ8u2NLgmgszg13pYrDKEoiu\n- https://example.com/my-web2-claim.json";

const BASE_FIELDS = {
  domain: "service.invalid",
  address: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
  statement: "I accept the ServiceOrg Terms of Service: https://service.invalid/tos",
  uri: "https://service.invalid/login",
  version: "1",
  chainId: "1",
  nonce: "32891756",
  issuedAt: "2021-09-30T16:25:24Z",
  network: "Ethereum",
};

test("toString", () => {
  const message = new SiwxMessage(BASE_FIELDS);
  assert.equal(SHORT_MESSAGE, message.toString());
});

test("fromString", () => {
  const message = SiwxMessage.fromString(SHORT_MESSAGE);
  assert.equal(message.domain, "service.invalid");
  assert.equal(message.network, "Ethereum");
  assert.equal(message.address, "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2");
  assert.equal(message.statement, "I accept the ServiceOrg Terms of Service: https://service.invalid/tos");
  assert.equal(message.uri, "https://service.invalid/login");
  assert.equal(message.version, "1");
  assert.equal(message.chainId, "1");
  assert.equal(message.nonce, "32891756");
  assert.equal(message.issuedAt, "2021-09-30T16:25:24Z");
  assert.equal(message.expirationTime, undefined);
  assert.equal(message.notBefore, undefined);
  assert.equal(message.requestId, undefined);
  assert.equal(message.resources, undefined);
});

test("fromString resources", () => {
  const message = SiwxMessage.fromString(WITH_RESOURCES);
  assert.equal(message.domain, "service.org");
  assert.equal(message.network, "Ethereum");
  assert.equal(message.address, "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2");
  assert.equal(message.statement, "I accept the ServiceOrg Terms of Service: https://service.org/tos");
  assert.equal(message.uri, "https://service.org/login");
  assert.equal(message.version, "1");
  assert.equal(message.chainId, "1");
  assert.equal(message.nonce, "32891757");
  assert.equal(message.issuedAt, "2021-09-30T16:25:24.000Z");
  assert.equal(message.expirationTime, undefined);
  assert.equal(message.notBefore, undefined);
  assert.equal(message.requestId, undefined);
  assert.equal(message.resources, [
    "ipfs://Qme7ss3ARVgxv6rXqVPiikMJ8u2NLgmgszg13pYrDKEoiu",
    "https://example.com/my-web2-claim.json",
  ]);
});

test("missing domain", () => {
  const INPUT =
    " wants you to sign in with your Ethereum account:\n0xe5A12547fe4E872D192E3eCecb76F2Ce1aeA4946\n\nI accept the ServiceOrg Terms of Service: https://service.org/tos\n\nURI: https://service.org/login\nVersion: 1\nChain ID: 1\nNonce: 12341234\nIssued At: 2022-03-17T12:45:13.610Z\nExpiration Time: 2023-03-17T12:45:13.610Z\nNot Before: 2022-03-17T12:45:13.610Z\nRequest ID: some_id\nResources:\n- https://service.org/login";
  assert.throws(() => SiwxMessage.fromString(INPUT), /domain can not be empty/);
});

test("out of order Expiration Time", () => {
  const INPUT =
    "service.org wants you to sign in with your Ethereum account:\n0xe5A12547fe4E872D192E3eCecb76F2Ce1aeA4946\n\nI accept the ServiceOrg Terms of Service: https://service.org/tos\n\nURI: https://service.org/login\nVersion: 1\nChain ID: 1\nNonce: 12341234\nIssued At: 2022-03-17T12:45:13.610Z\nNot Before: 2022-03-17T12:45:13.610Z\nExpiration Time: 2023-03-17T12:45:13.610Z\nRequest ID: some_id\nResources:\n- https://service.org/login";
  assert.throws(() => SiwxMessage.fromString(INPUT));
});

test("invalid issuedAt", () => {
  assert.throws(() => new SiwxMessage({ ...BASE_FIELDS, issuedAt: "" }));
  assert.throws(() => new SiwxMessage({ ...BASE_FIELDS, issuedAt: "2044-99-99T10:14Z" }));
  const withUndefined = { ...BASE_FIELDS, issuedAt: undefined } as unknown as SiwxMessageFields;
  assert.throws(() => new SiwxMessage(withUndefined));
});

test("notBefore", () => {
  assert.throws(() => new SiwxMessage({ ...BASE_FIELDS, notBefore: "" }));
  assert.throws(() => new SiwxMessage({ ...BASE_FIELDS, notBefore: "2044-99-99T10:14:01Z" }));
  assert.ok(new SiwxMessage({ ...BASE_FIELDS, notBefore: undefined }));
  assert.ok(new SiwxMessage({ ...BASE_FIELDS, notBefore: "2009-09-09T09:09:01Z" }));
});

test("expirationTime", () => {
  assert.throws(() => new SiwxMessage({ ...BASE_FIELDS, expirationTime: "" }));
  assert.throws(() => new SiwxMessage({ ...BASE_FIELDS, expirationTime: "2044-99-99T10:14:01Z" }));
  assert.ok(new SiwxMessage({ ...BASE_FIELDS, expirationTime: undefined }));
  assert.ok(new SiwxMessage({ ...BASE_FIELDS, expirationTime: "2009-09-09T09:09:01Z" }));
});

test.run();
