/* eslint-disable @typescript-eslint/no-unused-vars */
class CharNode {
  char: string;
  next: CharNode | null;
  prev: CharNode | null;

  constructor(char: string) {
    this.char = char;
    this.next = null;
    this.prev = null;
  }
}

export class EditorDataModel {
  private head: CharNode | null;
  private tail: CharNode | null;
  private index: CharNode[];
  public userId: string;
  public documentId: string;

  public cursor_position: number = 0;
  private lineStartPositions: number[] = [0];

  constructor(userId: string, documentId: string) {
    this.head = null;
    this.tail = null;
    this.index = [];
    this.userId = userId;
    this.documentId = documentId;
  }

  insertChar(char: string, position: number): void {
    const newNode = new CharNode(char);

    //Empty LinkedList
    if (!this.head) {
      this.head = newNode;
      this.tail = newNode;
      this.index.push(newNode);
      console.log("head", this.index.length);
      this.cursor_position++;

      return;
    }

    const pos = Math.min(position, this.index.length);

    //If insert is at tail node
    if (pos === this.index.length) {
      const lastNode = this.tail;
      if (lastNode) {
        newNode.prev = lastNode;
        lastNode.next = newNode;
      }
      this.index.push(newNode);
      console.log("tail", this.index.length);
      if (char === "\n") this.updateLineInfo();
      this.cursor_position++;
      return;
    }

    const currNode = this.index[pos];
    const prevNode = currNode?.prev;
    if (prevNode) {
      prevNode.next = newNode;
      newNode.prev = prevNode;
    } else {
      this.head = newNode;
    }
    newNode.next = currNode;
    currNode.prev = newNode;
    this.index.splice(pos, 0, newNode);
    if (char === "\n") this.updateLineInfo();
    this.cursor_position++;
  }

  deleteChar(position: number) {
    if (position - 1 < 0 || position - 1 >= this.index.length) return;

    const node = this.index[position - 1];

    if (node.prev) node.prev.next = node.next;
    if (node.next) node.next.prev = node.prev;

    if (this.head === node) this.head = node.next;
    if (this.tail === node) this.tail = node.prev;

    this.index.splice(position - 1, 1);

    this.cursor_position--;

    this.updateLineInfo();
  }

  getText(): string {
    let text = "";
    this.index.map((node, index) => {
      text += node.char;
    });
    console.log("Current text:", text);

    return text;
  }


  getPosition(
    x: number,
    y: number,
    fontInfo: { width: number; height: number }
  ): number {
    const text = this.getText();
    // const lineIndex = Math.floor(y/fontInfo.height);
    let lineIndex = Math.floor(y / fontInfo.height);
    lineIndex = Math.min(lineIndex, this.lineStartPositions.length - 1);
    console.log("lineIndex", lineIndex);
    if (lineIndex < 0) return 1;

    const lineStart = this.lineStartPositions[lineIndex];
    const horizontalOffset = Math.floor(x / fontInfo.width);
    const netPosition = lineStart + horizontalOffset - 1;
    console.log("lineIndex", lineIndex);
    let lineEnd;
    if (lineIndex < this.lineStartPositions.length - 1) {
      lineEnd = this.lineStartPositions[lineIndex + 1] - 1;
    } else {
      lineEnd = text.length;
    }
    // console.log("x position", Math.floor(x / 8));
    console.log("netPosition", Math.min(netPosition, lineEnd));
    return Math.min(netPosition, lineEnd);
  }

  setCursorPosition(position: number) {
    this.cursor_position = position;
  }

  updateLineInfo = (): void => {
    const text = this.getText();
    this.lineStartPositions = [0];

    for (let i = 0; i < text.length; i++) {
      const ch = text[i];

      if (ch === "\n") {
        this.lineStartPositions.push(i + 1);
      }
    }
  };

  getTextWithCursor(cursorPosition: number): string {
    const text = this.getText();
    const cursorHTML = "<span class='cursor blink'></span>";
    const textWithCursor =  text.slice(0, cursorPosition) + cursorHTML + text.slice(cursorPosition);
    return textWithCursor;

  }

  moveCursorUp(): void{
     let currLineIndex = 0;

     for(let i = 0; i < this.lineStartPositions.length; i++){
        if((this.cursor_position < this.lineStartPositions[i + 1]) || i == this.lineStartPositions.length - 1){
          currLineIndex = i;
          break;
        }
     }

     const offSet = this.cursor_position - this.lineStartPositions[currLineIndex];
     
  }


}
