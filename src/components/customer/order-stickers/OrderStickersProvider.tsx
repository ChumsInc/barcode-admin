import {type ReactNode, startTransition, useCallback, useEffect, useMemo, useState} from "react";
import OrderStickersContext from "@/components/customer/order-stickers/OrderStickersContext.tsx";
import {useAppSelector} from "@/app/configureStore.ts";
import {selectItems} from "@/ducks/customer/customerItemsSlice.ts";
import {buildDetailRecord} from "@/components/customer/order-stickers/utils.ts";
import type {DetailRecord} from "@/components/customer/order-stickers/types.ts";
import {useSalesOrder} from "@/components/customer/order-stickers/useSalesOrder.ts";

export interface OrderStickersProviderProps {
    children: ReactNode;
}


export default function OrderStickersProvider({children}: OrderStickersProviderProps) {
    const {orderDetail} = useSalesOrder();
    const customerItems = useAppSelector(selectItems);
    const [extra, setExtra] = useState<number>(3);
    const [detail, setDetail] = useState<DetailRecord>(buildDetailRecord(orderDetail, customerItems, extra));
    const setLineChecked = useCallback((lineKey: string, checked: boolean) => {
        setDetail((nextValue) => {
            if (nextValue[lineKey]) {
                nextValue[lineKey].selected = checked;
            }
            return {...nextValue};
        })
    }, []);

    const setAllChecked = useCallback((checked: boolean) => {
        setDetail((nextValue) => {
            Object.values(nextValue).forEach(od => od.selected = checked);
            return {...nextValue};
        })
    }, []);

    const setLineStickerQty = useCallback((lineKey: string, stickerQty: number) => {
        setDetail((nextValue) => {
            if (nextValue[lineKey]) {
                nextValue[lineKey].stickerQty = stickerQty;
            }
            return {...nextValue};
        })
    }, []);

    const handleSetExtra = useCallback((value: number) => {
        setExtra(value);
        setDetail(buildDetailRecord(orderDetail, customerItems, value));
    }, [orderDetail, customerItems]);

    useEffect(() => {
        startTransition(() => {
            setDetail(buildDetailRecord(orderDetail, customerItems, extra));
        })
    }, [orderDetail, customerItems, extra]);

    const value = useMemo(() => {
        return {
            extra,
            setExtra: handleSetExtra,
            setLineChecked,
            setAllChecked,
            detail: Object.values(detail),
            setLineStickerQty,
            count: Object.values(detail).filter(d => d.selected).map(d => d.stickerQty ?? 0).reduce((acc, v) => acc + v, 0)
        }
    }, [detail, extra, handleSetExtra, setAllChecked, setLineChecked, setLineStickerQty])

    return (
        <OrderStickersContext value={value}>
            {children}
        </OrderStickersContext>
    )
}


