import type {SortProps} from "chums-types";
import type {BarcodeSODetailLine} from "@/src/types.ts";
import {createContext} from "react";

export interface PrintOptionsContextProps {
    sort:SortProps<BarcodeSODetailLine>;
    setSort: (sort:SortProps<BarcodeSODetailLine>) => void;
    reversed: boolean;
    setReversed: (reversed: boolean) => void;
    includeQuantity: boolean;
    setIncludeQuantity: (includeQuantity: boolean) => void;
    shipToCode: string;
    setShipToCode: (shipToCode: string) => void;
}

const PrintOptionsContext = createContext<PrintOptionsContextProps | null>(null);
export default PrintOptionsContext;
