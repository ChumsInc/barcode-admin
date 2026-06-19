import type {SalesOrderDetailLine, SalesOrderHeader} from "chums-types";
import {createContext} from "react";
import type {SalesOrderProviderStatus} from "@/components/customer/order-stickers/types.ts";

export interface SalesOrderContextProps {
    orderHeader: SalesOrderHeader | null;
    orderDetail: SalesOrderDetailLine[];
    status: SalesOrderProviderStatus;
    error: string | null;
    isPending: boolean;
    salesOrderNo: string;
    shipToCodes: string[],
    loadSalesOrder: (salesOrderNo: string) => void;
}

const SalesOrderContext = createContext<SalesOrderContextProps | null>(null);
export default SalesOrderContext;
