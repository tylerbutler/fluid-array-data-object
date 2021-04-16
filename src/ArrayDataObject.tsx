/* eslint-disable react/prop-types */
import { SharedJson1 } from "@fluid-experimental/sharejs-json1";
import { DataObject } from "@fluidframework/aqueduct";
import { IFluidHandle } from "@fluidframework/core-interfaces";
import { IValueChanged, SharedMap } from "@fluidframework/map";
import { IFluidHTMLOptions, IFluidHTMLView } from "@fluidframework/view-interfaces";
import * as React from "react";
import * as ReactDOM from "react-dom";
import ReactJson, { InteractionProps } from "react-json-view";
import { Doc, IArray } from "./types";

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
        const newState = SharedJson1.create(this.runtime);
        // const initialData = JSON.parse(JSON.stringify(myArray));

        newState.replace([], true, []);
        this.root.set("json1", newState.handle);

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

interface IProps {
    dataObject: ArrayDataObject<any>,
}

const randomInt = (min: number, max: number): number => {
    // eslint-disable-next-line no-param-reassign
    min = Math.ceil(min);
    // eslint-disable-next-line no-param-reassign
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

export const UI: React.FC<IProps> = (props) => {
    const push = (dataobj: ArrayDataObject<any>) => {
        dataobj.push(dataobj.length);
        dataobj.log();
    };

    const unshift = (dataobj: ArrayDataObject<any>) => {
        dataobj.unshift(-dataobj.length);
        dataobj.log();
    };

    const remove = (dataobj: ArrayDataObject<any>) => {
        dataobj.delete(randomInt(0, dataobj.length - 1));
        dataobj.log();
    };

    const insert = (dataobj: ArrayDataObject<any>) => {
        dataobj.insert(randomInt(0, dataobj.length - 1), "inserted");
        dataobj.log();
    };

    const onAdd = (add: InteractionProps) => {
        console.log(`onAdd`);
        const index = (add.existing_value as any[]).length;
        props.dataObject.insert(index, (add.new_value as any[])[index]);
        console.log(add);
    };

    const onDelete = (add: InteractionProps) => {
        console.log(`onDelete`);
        if (add.name) {
            props.dataObject.delete(parseInt(add.name, 10));
        }
        console.log(add);
    };

    const onEdit = (add: InteractionProps) => {
        console.log(`onEdit`);
        if (add.name) {
            props.dataObject.set(parseInt(add.name, 10), add.new_value);
        }
        console.log(add);
    };

    return (
        <div>
            <button onClick={(event) => push(props.dataObject)}>Push</button>
            <button onClick={(event) => unshift(props.dataObject)}>Unshift</button>
            <button onClick={(event) => remove(props.dataObject)}>Delete</button>
            <button onClick={(event) => insert(props.dataObject)}>Insert</button>
            <button onClick={(event) => props.dataObject.clear()}>Clear</button>
            <button onClick={(event) => props.dataObject.log()}>Log</button>
            <ReactJson
                src={props.dataObject.state}
                theme="flat"
                enableClipboard={false}
                displayObjectSize={true}
                onAdd={onAdd}
                onDelete={onDelete}
                onEdit={onEdit}
            />
        </div>
    );
};
