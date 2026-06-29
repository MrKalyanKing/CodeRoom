/**
 * Domain B (client) — textarea → delta op
 *
 * Given two strings (old value, new value), produces a minimal op
 * { from, to, insert } describing the single changed region.
 *
 * Strategy: strip the longest common prefix, then the longest common suffix
 * of what remains. The middle block is the edit.
 */
export function diffToOp(oldVal, newVal) {
  let start = 0;
  const maxLen = Math.min(oldVal.length, newVal.length);

  while (start < maxLen && oldVal[start] === newVal[start]) start++;

  let oldEnd = oldVal.length;
  let newEnd = newVal.length;
  while (
    oldEnd > start &&
    newEnd > start &&
    oldVal[oldEnd - 1] === newVal[newEnd - 1]
  ) {
    oldEnd--;
    newEnd--;
  }

  return {
    from: start,
    to: oldEnd,
    insert: newVal.slice(start, newEnd),
  };
}

/**
 * Apply an op to a string (mirrors the server).
 */
export function applyOp(content, op) {
  return content.slice(0, op.from) + op.insert + content.slice(op.to);
}

/**
 * Shift a caret position through an op so it stays consistent
 * after a remote edit lands.
 */
export function shiftCaret(caret, op) {
  const deleteLen = op.to - op.from;
  const insertLen = op.insert.length;

  if (caret <= op.from) return caret;
  if (caret <= op.to) return op.from + insertLen;
  return caret - deleteLen + insertLen;
}
