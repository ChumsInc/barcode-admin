import type {BarcodeItem, SearchItem} from "chums-types";
import {createContext} from "react";

export interface ItemEditorContextProps {
    sageItem: SearchItem|null;
    setSageItem: (sageItem: SearchItem|null|undefined) => void;
    applySageField: (field: keyof SearchItem, itemField: keyof BarcodeItem) => void;
    canEdit: boolean;
    canAssignNewUPC: boolean;
}

const ItemEditorContext = createContext<ItemEditorContextProps | null>(null);
export default ItemEditorContext;
