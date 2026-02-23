
import { isNullish } from './nullish'

export function isIterable(input: unknown): input is Iterable<unknown> {
  if (isNullish(input)) return false;

  // An object is iterable if it has a callable `Symbol.iterator` property
  // See: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols#the_iterator_protocol
  return typeof (input as any)[Symbol.iterator] === 'function';
}
