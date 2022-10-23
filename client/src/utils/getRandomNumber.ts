export function getRandomNumber(min: number, max: number) {
  return Math.abs(Math.random() * (max - min) + min);
}

export function getRandomNumberNoLimit() {
  return getRandomNumber(0, 99999999);
}
