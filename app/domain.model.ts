export type Joke = {
  id: string;
  name: string;
  content: string;
  createdAt: Date;
  updatedAt: Date | null;
};

export type User = {
  id: string;
  username: string;
  passwordHash: string;
  createdAt: Date;
  updatedAt: Date | null;
};
