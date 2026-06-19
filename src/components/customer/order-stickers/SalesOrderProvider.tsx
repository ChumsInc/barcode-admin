import {type ReactNode, useCallback, useEffect, useMemo, useRef, useState, useTransition} from "react";
import SalesOrderContext, {
    type SalesOrderContextProps
} from "@/components/customer/order-stickers/SalesOrderContext.tsx";
import type {SalesOrderDetailLine, SalesOrderHeader} from "chums-types";
import type {SalesOrderProviderStatus} from "@/components/customer/order-stickers/types.ts";
import {fetchSalesOrder} from "@/api/order-stickers.ts";
import {useSearchParams} from "react-router";
import {getOrderColumns} from "@/ducks/salesOrder/order-detail-fields.tsx";
import {DataTableProvider} from "@chumsinc/sortable-tables";
import {useAppSelector} from "@/app/configureStore.ts";
import {selectCustomerSettings} from "@/ducks/customer/customerSettingsSlice.ts";

export interface SalesOrderProviderProps {
    children: ReactNode;
}

export default function SalesOrderProvider({children}: SalesOrderProviderProps) {
    const customerSettings = useAppSelector(selectCustomerSettings)
    const [searchParams, setSearchParams] = useSearchParams()
    const [salesOrderNo, setSalesOrderNo] = useState<string | null>(null);
    const [salesOrderHeader, setSalesOrderHeader] = useState<SalesOrderHeader | null>(null);
    const [detail, setDetail] = useState<SalesOrderDetailLine[]>([]);
    const [status, setStatus] = useState<SalesOrderProviderStatus>('idle');
    const [error, setError] = useState<string | null>(null);
    const abortControllerRef = useRef<AbortController | null>(null);
    const [isPending, startTransition] = useTransition();

    const loadSalesOrder = useCallback((salesOrderNo: string) => {
        const controller = new AbortController();
        if (abortControllerRef.current) {
            abortControllerRef.current.abort('New sales order requested.');
        }
        setSalesOrderNo(salesOrderNo);
        if (salesOrderNo === '') {
            startTransition(() => {
                setSearchParams(prev => {
                    prev.delete('salesOrderNo');
                    return prev;
                }, {replace: true});
            })
            setSalesOrderHeader(null);
            setDetail([]);
            return;
        }
        setSearchParams((next) => {
            next.set('salesOrderNo', salesOrderNo);
            return next;
        }, {replace: true})

        abortControllerRef.current = controller;

        startTransition(async () => {
            setStatus('loading');
            setError(null);
            setSalesOrderHeader(null);
            setDetail([]);
            try {
                const so = await fetchSalesOrder(salesOrderNo, {signal: controller.signal})
                startTransition(() => {
                    setStatus('idle');
                    if (controller.signal.aborted) {
                        return;
                    }
                    if (!so) {
                        setError('Sales order not found.');
                        return;
                    }
                    if (so.OrderStatus === 'X') {
                        setError('Sales order is cancelled.');
                    }
                    const {detail, invoices, payment, ...header} = so;
                    setSalesOrderHeader(header)
                    setDetail(detail ?? [])
                })
            } catch (err: unknown) {
                if (err instanceof Error) {
                    console.debug("()", err.message);
                    startTransition(() => {
                        setError(err.message);
                    })
                    return;
                }
                startTransition(() => {
                    setError('Unknown error when loading sales order.');
                })
                return;
            }
        });
    }, [setSearchParams]);

    useEffect(() => {
        const so = searchParams.get('salesOrderNo');
        if (error || isPending) {
            return;
        }
        console.debug()
        if (so && so !== salesOrderNo) {
            startTransition(() => {
                loadSalesOrder(so);
            })
        }
    }, [searchParams, isPending, error, salesOrderNo, loadSalesOrder]);

    const value: SalesOrderContextProps = useMemo(() => {
        return {
            orderHeader: salesOrderHeader,
            orderDetail: detail,
            status,
            error,
            isPending,
            salesOrderNo: salesOrderHeader?.SalesOrderNo ?? '',
            shipToCodes: detail.reduce((acc, sd) => {
                if (sd.UDF_SHIP_CODE && !acc.includes(sd.UDF_SHIP_CODE)) {
                    acc.push(sd.UDF_SHIP_CODE);
                }
                return acc;
            }, [] as string[]).sort(),
            loadSalesOrder,
        }
    }, [detail, error, isPending, loadSalesOrder, salesOrderHeader, status]);

    return (
        <DataTableProvider initialFields={getOrderColumns(customerSettings)}
                           initialSort={{field: 'BinLocation', ascending: true}}>
            <SalesOrderContext value={value}>{children}</SalesOrderContext>
        </DataTableProvider>
    )
}
