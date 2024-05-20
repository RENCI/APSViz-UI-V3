function swap(arr, i, j) {
  // ensure our pair has i < j
  const [a, b] = [i, j].sort();
  // bail out for select (a, b) pairs.
  if (
    a === b // indices aren't distinct
    || a < 0 // a too small
    || b < 1 // b too small
    || arr.length - 2 < a // a too big
    || arr.length - 1 < b // b too big
  ) { return arr; }

  const newArr = [...arr];
  const temp = newArr[i];
  newArr[i] = newArr[j];
  newArr[j] = temp;
  return newArr;
}

function remove(arr, indexFinder) {
  const index = arr.findIndex(el => indexFinder(el));
  if (index === -1) {
    return;
  }
  return [...arr.slice(0, index), ...arr.slice(index + 1)];
}

export default {
  swap,
  remove,
};
