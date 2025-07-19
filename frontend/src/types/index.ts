export interface User {
    id: string,
    name: string;
    color: string;
}

export interface Room {
  id: string;
  code: string;
  name: string;
  createdAt: Date;
  users: User[];
}