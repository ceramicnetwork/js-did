import { test } from "uvu";
import * as assert from "uvu/assert";
import * as fs from "node:fs/promises";
import * as t from "codeco";
import { SiwxMessage } from "../siwx-message.js";

const Fields = t.sparse({
  domain: t.string,
  address: t.string,
  uri: t.string,
  version: t.string,
  chainId: t.string,
  nonce: t.string,
  issuedAt: t.string,
  network: t.string,
  statement: t.optional(t.string)
});

const ValidEntry = t.type({
  message: t.string,
  status: t.literal("valid"),
  fields: Fields,
});

const InvalidEntry = t.type({
  message: t.string,
  status: t.literal("invalid"),
});

const ChainVector = t.record(t.string, t.union([ValidEntry, InvalidEntry]));
type ChainVector = t.TypeOf<typeof ChainVector>;

async function readVector(filename: URL): Promise<ChainVector> {
  const contents = await fs.readFile(filename, "utf8");
  const parsed = JSON.parse(contents);
  return t.decode(ChainVector, parsed);
}

const ethereumVectors = await readVector(new URL("../../data/vectors/ethereum-messages.json", import.meta.url));

for (const [name, entry] of Object.entries(ethereumVectors)) {
  const isValid = ValidEntry.is(entry);
  if (isValid) {
    test(name, () => {
      // fromString -> toFields
      const fromString = SiwxMessage.fromString(entry.message);

      // fromFields -> toString
      const fromFields = new SiwxMessage(entry.fields);
      const toString = fromFields.toString();

      assert.equal(toString, entry.message, "toString do not match with provided message");
      assert.equal(fromString, fromFields, "fromString do not match with provided fields");
    });
  } else {
    assert.throws(() => SiwxMessage.fromString(entry.message), `Expect invalid: ${name}`);
  }
}

test.run();
