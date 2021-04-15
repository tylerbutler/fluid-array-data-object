import EventEmitter from "events";

export type Doc = string | number | boolean | Doc[];

export interface IArray<T> extends EventEmitter {
    readonly state: T[];
    insert(index: number, content: T): T[];
    push(content: T): number;
    unshift(content: T): number;
    delete(index: number, length?: number): T[];
    get(index: number): T;
    set(index: number, content: T): number;
    length: number;
    on(event: "arrayModified", listener: () => void): this;
}
