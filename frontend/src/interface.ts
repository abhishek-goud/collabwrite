export interface CursorPosition {
  userId: string;
  username?: string;
  position: number;
  color: string;
}

export interface TextOperation {
  action: "insert" | "delete";
  position: number;
  character?: string;
  userId: string;
}