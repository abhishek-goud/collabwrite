/* eslint-disable @typescript-eslint/no-unused-vars */
class CharNode{
    char: string;
    next: CharNode | null;
    prev: CharNode | null;

    constructor(char: string) {
        this.char = char;
        this.next = null;
        this.prev = null;
    }
}

export class EditorDataModel{
    private head: CharNode | null;
    private tail: CharNode | null;
    private index: CharNode[];
    public userId: string;
    public documentId: string;

    public cursor_position: number = 0;
    private lineStartPositions: number[] = [];
    private lineWidths: number[] = [];  

    constructor(userId: string, documentId: string) {
        this.head = null;
        this.tail = null;
        this.index = [];
        this.userId = userId;
        this.documentId = documentId;
    }

    insertChar(char: string, position: number): void {
        const node = new CharNode(char);
        if(!this.head){
            this.head = node;
            this.tail = node;
            this.index.push(node);
            console.log("head", this.index.length)
            this.cursor_position++;
           
            return;
        }

        const pos = Math.min(position, this.index.length);

        if(pos === this.index.length){
            const lastNode = this.tail;
            if(lastNode){
                node.prev = lastNode;
                lastNode.next = node;
            }
            this.index.push(node);
            console.log("tail", this.index.length)
            this.cursor_position++
            
            return;
        }

        const currNode = this.index[pos];
        const prevNode = currNode?.prev;
        if(prevNode){
            prevNode.next = node;
            node.prev = prevNode;
        }
        else {
            this.head = node;
        }
        this.index.splice(pos, 0, node);
        node.next = currNode;
        currNode.prev = node;
        this.cursor_position++;    
        
    }

    deleteChar(position: number){
        if(position - 1 < 0 || position - 1 >= this.index.length) return;

        const node = this.index[position];

        if(node.prev) node.prev.next = node.next;
        if(node.next) node.next.prev = node.prev;

        if(this.head === node) this.head = node.next;
        if(this.tail === node) this.tail = node.prev;

        this.index.splice(position, 1);

        this.cursor_position--;
    }

    getText(): string{
        let text = "";
        this.index.map((node, index) => {
            text += node.char;
        })
        console.log("Current text:", text);

        return text;
    }

    
}