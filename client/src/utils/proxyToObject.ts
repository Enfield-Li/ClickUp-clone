export function toPlainObject(proxy: object) {
  return JSON.parse(JSON.stringify(proxy));
}
