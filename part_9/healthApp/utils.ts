export const isNotNumber = (argument: unknown): boolean => {
  return isNaN(Number(argument));
};
