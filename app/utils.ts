import { ZodIssue } from 'zod';

/**
 * Get error message of desired field from a list of ZodIssue.
 */
export const getMessageFromZodIssues = (issues: Array<ZodIssue>, field: string): string | undefined => {
  return issues.find((issue) => issue.path.includes(field))?.message;
};
