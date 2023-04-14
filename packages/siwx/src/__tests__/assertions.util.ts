import * as assert from "uvu/assert";
import { isLeft, isRight } from "codeco";
import { StringTape, type Combinator } from "codeco/linear";

export function assertParse<TValue>(
  actual: string,
  combinator: Combinator<TValue, string>,
  expected: TValue | string = actual
) {
  const result = combinator(new StringTape(String(actual)));
  if (isLeft(result)) throw result.left;
  assert.equal(result.right, expected);
}

export function assertNotParse<TValue>(actual: string, combinator: Combinator<TValue, string>) {
  const result = combinator(new StringTape(String(actual)));
  if (isRight(result)) {
    assert.unreachable(`Expected Left, got Right(${result.right})`);
  }
}
