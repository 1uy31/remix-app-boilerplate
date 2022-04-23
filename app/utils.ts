import { ZodIssue } from 'zod';

export const throwIfUndefined = (value: any, errorMessage?: string): any => {
  if (value === undefined) {
    throw new Error(errorMessage || `Unexpected undefined value ${value}!`);
  }
  return value;
};

/**
 * Get error message of desired field from a list of ZodIssue.
 */
export const getMessageFromZodIssues = (issues: Array<ZodIssue>, field: string): string | undefined => {
  return issues.find((issue) => issue.path.includes(field))?.message;
};
