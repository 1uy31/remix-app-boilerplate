export type User = {
  id: string;
  username: string;
  passwordHash: string;
  createdAt: Date;
  updatedAt: Date | null;
};
