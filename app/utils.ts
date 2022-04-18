export const throwIfUndefined = (value: any, errorMessage?: string): any => {
  if (value === undefined) {
    throw new Error(errorMessage || `Unexpected undefined value ${value}!`);
  }
  return value;
};
