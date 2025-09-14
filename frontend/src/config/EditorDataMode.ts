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
  private lineWidths: number[] = [];

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
    // this.updateLineInfo();
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
    // console.log("Current text:", text);

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
    this.lineWidths = [];
    let width = 0;

    for (let i = 0; i < text.length; i++) {
      const ch = text[i];
      width++;
      if (ch === "\n") {
        this.lineWidths.push(width);
        width = 0;
        this.lineStartPositions.push(i + 1);
      }
    }
  };

  getTextWithCursor(cursorPosition: number): string {
    const text = this.getText();
    const cursorHTML = "<span class='cursor blink'></span>";
    const textWithCursor =
      text.slice(0, cursorPosition) + cursorHTML + text.slice(cursorPosition);
    return textWithCursor;
  }

  moveCursorUp(): void {
    let currLineIndex = 0;

    for (let i = 0; i < this.lineStartPositions.length; i++) {
      if (
        this.cursor_position < this.lineStartPositions[i + 1] ||
        i == this.lineStartPositions.length - 1
      ) {
        currLineIndex = i;
        break;
      }
    }

    if (currLineIndex == 0) return; // already at first line

    const offSet =
      this.cursor_position - this.lineStartPositions[currLineIndex] + 1;

    if (this.lineWidths[currLineIndex - 1] >= offSet)
      this.cursor_position =
        this.lineStartPositions[currLineIndex - 1] + offSet - 1;
    else
      this.cursor_position =
        this.lineStartPositions[currLineIndex - 1] +
        this.lineWidths[currLineIndex - 1] -
        1;
    return;
  }

  moveCursorDown(): void {
    let currLineIndex = 0;

    for (let i = 0; i < this.lineStartPositions.length; i++) {
      if (
        this.cursor_position < this.lineStartPositions[i + 1] ||
        i == this.lineStartPositions.length - 1
      ) {
        currLineIndex = i;
        break;
      }
    }
    console.log("size", this.lineStartPositions.length);
    console.log("downCurrLine", { currLineIndex });
    if (currLineIndex === this.lineStartPositions.length - 1) return;
    if (currLineIndex === this.lineWidths.length - 1) return;
    const offSet =
      this.cursor_position - this.lineStartPositions[currLineIndex] + 1;

    const nextOffSet = Math.min(offSet, this.lineWidths[currLineIndex + 1]);

    this.cursor_position =
      this.lineStartPositions[currLineIndex + 1] + nextOffSet - 1;
    const meta = {
      st: this.lineStartPositions[currLineIndex + 1],
      nextLineW: this.lineWidths[currLineIndex + 1],
      off: nextOffSet,
      netPos: this.cursor_position,
    };
    console.log("cursorDown", meta);
    console.log(this.lineWidths);
    return;
  }


  moveCursorLeft(): void{
     let currLineIndex = 0;

    for (let i = 0; i < this.lineStartPositions.length; i++) {
      if (
        this.cursor_position < this.lineStartPositions[i + 1] ||
        i == this.lineStartPositions.length - 1
      ) {
        currLineIndex = i;
        break;
      }
    }

    if(currLineIndex == 0){
       this.cursor_position = Math.max(0, this.cursor_position - 1);
       return;
    }

    // if(this.cursor_position - 1 < this.lineStartPositions[currLineIndex]) this.cursor_position = this.lineStartPositions[currLineIndex - 1] + this.lineWidths[currLineIndex - 1] - 1;
    // else this.cursor_position = this.cursor_position - 1;

    this.cursor_position = this.cursor_position - 1;
  
  }



  moveCursorRight(): void{
     let currLineIndex = 0;

    for (let i = 0; i < this.lineStartPositions.length; i++) {
      if (
        this.cursor_position < this.lineStartPositions[i + 1] ||
        i == this.lineStartPositions.length - 1
      ) {
        currLineIndex = i;
        break;
      }
    }

    if(currLineIndex == this.lineStartPositions.length - 1){
       this.cursor_position = Math.min(this.getText().length, this.cursor_position + 1);
       console.log("right", this.cursor_position);
       return;
    }

    // if(this.cursor_position - 1 < this.lineStartPositions[currLineIndex]) this.cursor_position = this.lineStartPositions[currLineIndex - 1] + this.lineWidths[currLineIndex - 1] - 1;
    // else this.cursor_position = this.cursor_position - 1;

    this.cursor_position = this.cursor_position + 1;
  
  }

  
}
