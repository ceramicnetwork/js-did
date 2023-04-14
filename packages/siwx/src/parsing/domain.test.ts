import { test } from "uvu";
import { assertNotParse, assertParse } from "../__tests__/assertions.util.js";
import { dnsauthority, domain, host, port, regName } from "./domain.js";

test("port", () => {
  assertParse("1234", port);
});

test("reg-name", () => {
  assertParse("aA3-._~!$&'()*af+,;=%a3%af", regName);
});

test("host", () => {
  assertParse("aA3-._~!$&'()*af+,;=%a3%af", host);
  assertParse("192.168.0.1", host);
  assertParse("[a0:a0::a0:a0:a0:a0]", host);
});

test("dnsauthority", () => {
  assertParse("192.168.0.1:3000", dnsauthority);
  assertParse("[a0:a0::a0:a0:a0:a0]", dnsauthority);
  assertParse("aA3-._~!$&'()*af+,;=%a3%af", dnsauthority);
  assertParse("example.com", dnsauthority);
  assertParse("", dnsauthority);
});

test("domain", () => {
  assertParse("192.168.0.1:3000", domain);
  assertParse("[a0:a0::a0:a0:a0:a0]", domain);
  assertParse("aA3-._~!$&'()*af+,;=%a3%af", domain);
  assertParse("example.com", domain);
  assertNotParse("", domain);
});

test.run();
