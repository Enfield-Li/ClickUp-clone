export const sleep = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

export const sleep2Second = () => sleep(2000);
