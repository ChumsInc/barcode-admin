import type {BarcodeSODetailLine} from "@/src/types.ts";
import {createContext} from "react";

export interface OrderStickersContextProps {
    extra: number;
    setExtra: (extra: number) => void;
    setLineChecked: (lineKey: string, checked: boolean) => void;
    setAllChecked: (checked: boolean) => void;
    detail: BarcodeSODetailLine[];
    setLineStickerQty: (lineKey: string, qty: number) => void;
    count: number;
}

const OrderStickersContext = createContext<OrderStickersContextProps | null>(null);
export default OrderStickersContext;
