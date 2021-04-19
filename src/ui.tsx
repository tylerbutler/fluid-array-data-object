import React from "react";
import ReactJson, { InteractionProps } from "react-json-view";
import { ArrayDataObject } from "./ArrayDataObject";

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
