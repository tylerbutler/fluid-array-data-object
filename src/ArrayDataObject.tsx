/* eslint-disable react/prop-types */
import { DataObject } from "@fluidframework/aqueduct";
import { IFluidHandle } from "@fluidframework/core-interfaces";
import { SharedJson1 } from "@fluid-experimental/sharejs-json1";
import { IFluidHTMLOptions, IFluidHTMLView } from "@fluidframework/view-interfaces";
import { SharedMap } from "@fluidframework/map";
import * as React from "react";
import * as ReactDOM from "react-dom";
import ReactJson from "react-json-view";

// import {produce} from "immer";

// import { Doc, type as Json1OTType, JSONOp, replaceOp, insertOp, moveOp, removeOp, Path } from "ot-json1";

// const myJson = {
//     a: "topLevel",
//     b: {
//         b1: "nested 1 level",
//         b2: {
//             b22: "nested 2 levels",
//         },
//     },
// };

type Doc = string | number | boolean | Doc[];

type ArItem = string | number | boolean | Doc;

interface IArray {
    insert(index: number, content: ArItem): ArItem[];
    push(content: ArItem): number;
    unshift(content: ArItem): number;
    delete(index: number, length?: number): ArItem[];
    get(index: number): ArItem;
    length: number;

}

const myArray = {
    array: [0, 1, 2],
};

export class ArrayDataObject<T extends Doc> extends DataObject implements IArray, IFluidHTMLView {
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
    protected async initializingFirstTime() {
        const newState = SharedJson1.create(this.runtime);
        const initialData = JSON.parse(JSON.stringify(myArray));

        newState.replace([], true, initialData.array);
        this.root.set("json1", newState.handle);

        const map = SharedMap.create(this.runtime);
        this.root.set("map", map.handle);
    }

    protected async hasInitialized() {
        this._store = await this.root.get<IFluidHandle<SharedJson1>>("json1")?.get();
        this.log();

        this._map = await this.root.get<IFluidHandle<SharedMap>>("map")?.get();
        console.log(this._map?.handle);
    }

    public render(elm: HTMLElement, options?: IFluidHTMLOptions): void {
        this.log();
        ReactDOM.render(
            <>
                <UI numButtons={2} do={this} />
            </>,
            elm,
        );
    }

    // IArray implementation
    insert(index: number, content: ArItem): ArItem[] {
        this._store?.insert([index], content);
        return Array.from(this.state);
    }
    push(content: ArItem): number {
        this._store?.insert(["-"], content);
        return this.length;
    }
    unshift(content: ArItem): number {
        this._store?.insert([0], content);
        return this.length;
    }
    delete(index: number, length?: number): ArItem[] {
        this._store?.remove([index]);
        return Array.from(this.state);
    }
    get(index: number): ArItem {
        return this.state[index];
    }
    public get length(): number {
        return this.state.length;
    }
}

interface IProps {
    numButtons: number,
    do: ArrayDataObject<any>,
}

const randomInt = (min: number, max: number): number => {
    // eslint-disable-next-line no-param-reassign
    min = Math.ceil(min);
    // eslint-disable-next-line no-param-reassign
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

export const UI: React.FC<IProps> = (props) => {
    // for(let i = 0; i < props.numButtons; i++) {
    // }

    const push = (dataobj: ArrayDataObject<any>) => {
        dataobj.push(dataobj.length + 1);
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

    return (
        <div>
            <ReactJson src={props.do.state} theme="hopscotch" />
            <button onClick={(event) => push(props.do)}>Push</button>
            <button onClick={(event) => unshift(props.do)}>Unshift</button>
            <button onClick={(event) => remove(props.do)}>Delete</button>
            <button onClick={(event) => insert(props.do)}>Insert</button>
            <button onClick={(event) => props.do.log()}>Log</button>
        </div>
    );
};
