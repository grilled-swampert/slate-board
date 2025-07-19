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


export interface DrawingTool {
  type: 'pen' | 'eraser' | 'line' | 'rectangle' | 'circle' | 'text';
  color: string;
  size: number;
}

export interface DrawingStroke {
  id: string;
  tool: DrawingTool;
  points: Point[];
  userId: string;
  timestamp: Date;
}

export interface Point {
  x: number;
  y: number;
}

export interface TextElement {
  id: string;
  x: number;
  y: number;
  text: string;
  color: string;
  size: number;
  userId: string;
  timestamp: Date;
}

export interface UserCursor {
  userId: string;
  x: number;
  y: number;
  userName: string;
  color: string;
}