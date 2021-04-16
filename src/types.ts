import EventEmitter from "events";

// from ot-json1
export type Doc = string | number | boolean | Doc[];

export interface IArray<T> extends EventEmitter {
    /**
     * Returns the current array. Callers should treat the returned value as immutable.
     * @alpha
     */
    readonly state: T[];

    /**
     * The number of items in the array.
     * @alpha
     */
    readonly length: number;

    /**
     * Inserts an item at the end of the array.
     *
     * @param content The item to add.
     * @returns The length of the array.
     * @alpha
     */
    push(content: T): number;

    /**
     * Inserts an item at the front of the array.
     *
     * @param content The item to add.
     * @returns The length of the array.
     * @alpha
     */
    unshift(content: T): number;

    /**
     * Inserts an item into the array.
     *
     * @param index The index at which to insert the item.
     * @param content The item to add.
     * @returns The array.
     * @alpha
     */
    insert(index: number, content: T): readonly T[];

    /**
     * Sets (replaces) an item in the array.
     *
     * @param index The index of the item to set.
     * @returns The length of the array.
     * @alpha
     */
    set(index: number, content: T): number;

    /**
     * Deletes an item from the array.
     *
     * @param index The index of the item to delete.
     * @param content The item to add.
     * @remarks
     * The array remains packed after an item is deleted. That is,
     * remaining items are shifted to the left.
     * @alpha
     */
    delete(index: number, length?: number): readonly T[];

    /**
     * Clears all items from the array, resetting its length to 0.
     *
     * @alpha
     */
    clear(): void;

    /**
     * Not yet implemented.
     *
     * @param event
     * @param listener
     * @alpha
     */
    on(event: "arrayModified", listener: () => void): this;
}
