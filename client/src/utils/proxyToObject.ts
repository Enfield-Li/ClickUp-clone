export function toPlainObject(object?: object) {
  return JSON.parse(JSON.stringify(object));
}
