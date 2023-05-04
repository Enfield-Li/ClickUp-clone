export function deepCopy(object?: object) {
  return JSON.parse(JSON.stringify(object));
}
