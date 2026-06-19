import {type ReactNode, useMemo, useState} from "react";
import PrintOptionsContext, {
    type PrintOptionsContextProps
} from "@/components/customer/order-stickers/PrintOptionsContext.tsx";
import type {BarcodeSODetailLine} from "@/src/types.ts";
import {useAppSelector} from "@/app/configureStore.ts";
import {selectCustomerSettings} from "@/ducks/customer/customerSettingsSlice.ts";
import {useSalesOrder} from "@/components/customer/order-stickers/useSalesOrder.ts";
import {useTableSort} from "@chumsinc/sortable-tables";

export interface PrintOptionsProviderProps {
    children: ReactNode;
}

export default function PrintOptionsProvider({children}: PrintOptionsProviderProps) {
    const customerSettings = useAppSelector(selectCustomerSettings);
    const {shipToCodes} = useSalesOrder();
    const [sort, setSort] = useTableSort<BarcodeSODetailLine>()
    const [reversed, setReversed] = useState(false);
    const [includeQuantity, setIncludeQuantity] = useState(customerSettings?.includeQtyInSticker ?? false);
    const [shipToCode, setShipToCode] = useState<string>(shipToCodes.length === 1 ? shipToCodes[0] : '');

    const value: PrintOptionsContextProps = useMemo(() => ({
        reversed,
        setReversed,
        sort: sort ?? {field: 'BinLocation', ascending: true},
        setSort,
        includeQuantity,
        setIncludeQuantity,
        shipToCode,
        setShipToCode
    }), [reversed, setReversed, sort, setSort, includeQuantity, setIncludeQuantity, shipToCode, setShipToCode])

    return (
        <PrintOptionsContext value={value}>
            {children}
        </PrintOptionsContext>
    )
}
