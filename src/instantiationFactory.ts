import { SharedJson1 } from "@fluid-experimental/sharejs-json1";
import { DataObjectFactory } from "@fluidframework/aqueduct";
import { SharedCell } from "@fluidframework/cell";
import { IEvent } from "@fluidframework/common-definitions";
import { SharedMap } from "@fluidframework/map";
import { SharedObjectSequence } from "@fluidframework/sequence";
import { ArrayDataObject } from "./ArrayDataObject";

const Name = "array-data-object";

export const ArrayDataObjectInstantiationFactory =
    new DataObjectFactory<ArrayDataObject<any>, undefined, undefined, IEvent>(
        Name,
        ArrayDataObject,
        [
            SharedMap.getFactory(),
            SharedCell.getFactory(),
            SharedObjectSequence.getFactory(),
            SharedJson1.getFactory(),
        ],
        {},
    );
