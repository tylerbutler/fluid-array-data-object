import { SharedJson1 } from "@fluid-experimental/sharejs-json1";
import { DataObject } from "@fluidframework/aqueduct";
import { IFluidHandle } from "@fluidframework/core-interfaces";
import { IValueChanged, SharedMap } from "@fluidframework/map";
import { IFluidHTMLOptions, IFluidHTMLView } from "@fluidframework/view-interfaces";
import * as React from "react";
import * as ReactDOM from "react-dom";
import negativeArray from "negative-array";
import { Doc, IArray } from "./types";
import { UI } from "./ui";

export class ArrayDataObject<T extends Doc> extends DataObject implements IArray<T>, IFluidHTMLView {
    /**
     * {@inheritDoc IArray.state}
     */
     public get state(): T[] {
        if (this._store) {
            return this._store.get() as T[];
        }
        return [];
    }

    public log(): void {
        console.log(this.state);
    }
    public get IFluidHTMLView() { return this; }

    private _store: SharedJson1 | undefined;
    private _map: SharedMap | undefined;
    private _elm!: HTMLElement;
    protected async initializingFirstTime() {
        const newStore = SharedJson1.create(this.runtime);
        // const initialData = JSON.parse(JSON.stringify(myArray));

        newStore.replace([], true, []);
        this.root.set("json1", newStore.handle);

        const map = SharedMap.create(this.runtime);
        this.root.set("map", map.handle);
    }

    protected async hasInitialized() {
        this._store = await this.root.get<IFluidHandle<SharedJson1>>("json1")?.get();
        this._store?.on("op", () => {
            this.render();
            this.emit("arrayModified");
        });
        this.log();

        this._map = await this.root.get<IFluidHandle<SharedMap>>("map")?.get();
        console.log(this._map?.handle);

        this.root.on("valueChanged", (changed: IValueChanged) => {
            this.render();
        });
    }

    public render(elm?: HTMLElement, options?: IFluidHTMLOptions): void {
        // TODO: Clean this up because it's a mess.
        if (!this._elm) {
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            this._elm = elm!;
        }

        if (!elm) {
            // eslint-disable-next-line no-param-reassign
            elm = this._elm;
        }

        this.log();
        ReactDOM.render(
            <>
                <UI dataObject={this} />
            </>,
            elm,
        );
    }

    // IArray implementation
    /**
     * {@inheritDoc IArray.insert}
     */
    insert(index: number, content: T): readonly T[] {
        this._store?.insert([index], content);
        return Array.from(this.state);
    }
    /**
     * {@inheritDoc IArray.push}
     */
     push(content: T): number {
        this._store?.insert([this.length], content);
        return this.length;
    }
    /**
     * {@inheritDoc IArray.unshift}
     */
     unshift(content: T): number {
        this._store?.insert([0], content);
        return this.length;
    }
    /**
     * {@inheritDoc IArray.delete}
     */
     delete(index: number): readonly T[] {
        this._store?.remove([index]);
        return Array.from(this.state);
    }
    /**
     * {@inheritDoc IArray.get}
     */
     get(index: number): T | undefined {
        if(index >= this.length) {
            return undefined;
        }

        if(index < 0) {
            return negativeArray(this.state)[index];
        }
        return this.state[index];
    }

    /**
     * {@inheritDoc IArray.set}
     */
     set(index: number, content: T): number {
        this._store?.replace([index], true, content);
        return this.length;
    }

    /**
     * {@inheritDoc IArray.clear}
     */
     clear(): void {
        this._store?.replace([], true, []);
    }

    /**
     * {@inheritDoc IArray.length}
     */
     public get length(): number {
        return this.state.length;
    }
}
