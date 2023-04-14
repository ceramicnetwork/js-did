import { test } from "uvu";
import { assertNotParse, assertParse } from "../__tests__/assertions.util.js";
import { decOctet, h16, ipLiteral, ipv4Address, ipv6address, ls32 } from "./ip-address.js";

test("h16", () => {
  assertNotParse("", h16);
  assertParse("0f", h16);
  assertParse("cafe", h16);
  assertParse("DEADBEAF", h16);
});

test("dec-octet", () => {
  assertParse("1", decOctet);
  assertParse("21", decOctet);
  assertParse("99", decOctet);
  assertParse("124", decOctet);
  assertParse("199", decOctet);
  assertParse("249", decOctet);
  assertParse("254", decOctet);
  assertParse("255", decOctet);
});

test("ipv4Address", () => {
  assertParse("0.0.0.0", ipv4Address);
  assertParse("192.168.0.1", ipv4Address);
  assertParse("255.255.255.255", ipv4Address);
  assertNotParse("0.025.01.0", ipv4Address);
});

test("ls32", () => {
  assertParse("0.0.0.0", ls32);
  assertParse("192.168.0.1", ls32);
  assertParse("255.255.255.255", ls32);
  assertNotParse("0.025.01.0", ls32);
  assertParse("deadbeaf:cafebabe", ls32);
});

test("ipv6address", () => {
  // 6
  assertParse("a0:a0:a0:a0:a0:a0:a0:a0", ipv6address);
  assertParse("a0:a0:a0:a0:a0:a0:127.0.0.1", ipv6address);
  // 5
  assertParse("::a0:a0:a0:a0:a0:a0:a0", ipv6address);
  assertParse("::a0:a0:a0:a0:a0:127.0.0.1", ipv6address);
  // 4
  assertParse("a0::a0:a0:a0:a0:a0:a0", ipv6address);
  assertParse("::a0:a0:a0:a0:a0:a0", ipv6address);
  // 3
  assertParse("a0::a0:a0:a0:a0:a0", ipv6address);
  assertParse("a0:a0::a0:a0:a0:a0:a0", ipv6address);
  // 2
  assertParse("::a0:a0:a0:a0", ipv6address);
  assertParse("a0::a0:a0:a0:a0", ipv6address);
  assertParse("a0:a0::a0:a0:a0:a0", ipv6address);
  assertParse("a0:a0:a0::a0:a0:a0:a0", ipv6address);
  // 1
  assertParse("::a0:a0:a0", ipv6address);
  assertParse("a0::a0:a0:a0", ipv6address);
  assertParse("a0:a0::a0:a0:a0", ipv6address);
  assertParse("a0:a0:a0::a0:a0:a0", ipv6address);
  assertParse("a0:a0:a0:a0::a0:a0:a0", ipv6address);
  // 0 ls32
  assertParse("::a0:a0", ipv6address);
  assertParse("a0::a0:a0", ipv6address);
  assertParse("a0:a0::a0:a0", ipv6address);
  assertParse("a0:a0:a0::a0:a0", ipv6address);
  assertParse("a0:a0:a0:a0::a0:a0", ipv6address);
  assertParse("a0:a0:a0:a0:a0::a0:a0", ipv6address);
  // 0 h16
  assertParse("::a0", ipv6address);
  assertParse("a0::a0", ipv6address);
  assertParse("a0:a0::a0", ipv6address);
  assertParse("a0:a0:a0::a0", ipv6address);
  assertParse("a0:a0:a0:a0::a0", ipv6address);
  assertParse("a0:a0:a0:a0:a0::a0", ipv6address);
  assertParse("a0:a0:a0:a0:a0:a0::a0", ipv6address);
  // 0::
  assertParse("::", ipv6address);
  assertParse("a0::", ipv6address);
  assertParse("a0:a0::", ipv6address);
});

test("IP-literal", () => {
  assertParse("[a0:a0:a0:a0:a0::a0]", ipLiteral);
});

test.run();
