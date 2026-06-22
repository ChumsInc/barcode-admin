import type {SalesOrderDetailLine, SalesOrderHeader} from "chums-types";
import {createContext} from "react";
import type {SalesOrderProviderStatus} from "@/components/customer/order-stickers/types.ts";
import type {GenerateStickerProps} from "@/src/types.ts";

export interface SalesOrderContextProps {
    orderHeader: SalesOrderHeader | null;
    orderDetail: SalesOrderDetailLine[];
    status: SalesOrderProviderStatus;
    error: string | null;
    isPending: boolean;
    salesOrderNo: string;
    shipToCodes: string[],
    loadSalesOrder: (salesOrderNo: string) => void;
    generateStickers: (arg:Pick<GenerateStickerProps, 'lines'|'reversed'>) => Promise<number>;
}

const SalesOrderContext = createContext<SalesOrderContextProps | null>(null);
export default SalesOrderContext;
