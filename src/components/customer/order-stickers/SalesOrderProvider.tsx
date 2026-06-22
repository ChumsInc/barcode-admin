import {type ReactNode, useCallback, useEffect, useMemo, useState, useTransition} from "react";
import SalesOrderContext, {
    type SalesOrderContextProps
} from "@/components/customer/order-stickers/SalesOrderContext.tsx";
import type {SalesOrderDetailLine, SalesOrderHeader} from "chums-types";
import type {SalesOrderProviderStatus} from "@/components/customer/order-stickers/types.ts";
import {fetchSalesOrder, postOrderStickers} from "@/api/order-stickers.ts";
import {useSearchParams} from "react-router";
import {getOrderColumns} from "@/components/customer/order-stickers/order-detail-fields.tsx";
import {DataTableProvider} from "@chumsinc/sortable-tables";
import {useAppSelector} from "@/app/configureStore.ts";
import {selectCustomerSettings} from "@/ducks/customer/customerSettingsSlice.ts";
import type {GenerateStickerProps} from "@/src/types.ts";

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
    const [isPending, startTransition] = useTransition();

    const loadSalesOrder = useCallback((salesOrderNo: string) => {
        console.debug('loadSalesOrder', salesOrderNo);
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

        startTransition(async () => {
            setSalesOrderNo(salesOrderNo);
            setStatus('loading');
            setError(null);
            setSalesOrderHeader(null);
            setDetail([]);
            try {
                const so = await fetchSalesOrder(salesOrderNo)
                startTransition(() => {
                    setStatus('idle');
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

    const generateStickers = useCallback(async ({lines, reversed}:Pick<GenerateStickerProps, 'lines'|'reversed'>) => {
        if (lines.length === 0) {
            return Promise.reject(new Error('No lines for generating stickers.'));
        }
        if (!salesOrderHeader || !customerSettings) {
            return Promise.reject(new Error('No sales order or customer settings.'));
        }
        setStatus('generating');
        setError(null);
        try {
            const props: GenerateStickerProps = {
                customerId: customerSettings.id,
                SalesOrderNo: salesOrderHeader.SalesOrderNo,
                CustomerPONo: salesOrderHeader.CustomerPONo ?? '',
                lines: lines,
                reversed,
            }
            const result = await postOrderStickers(props);
            setStatus('idle');
            return result;
        } catch(err:unknown) {
            return Promise.reject(err);
        }
    }, [customerSettings, salesOrderHeader]);

    useEffect(() => {
        const so = searchParams.get('salesOrderNo');
        if (so && so !== salesOrderNo) {
            startTransition(() => {
                console.log('Sales order changed', so, salesOrderNo);
                loadSalesOrder(so);
            })
        }
    }, [searchParams, salesOrderNo, loadSalesOrder]);

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
            generateStickers,
        }
    }, [detail, error, isPending, loadSalesOrder, salesOrderHeader, status, generateStickers]);

    return (
        <DataTableProvider initialFields={getOrderColumns(customerSettings)}
                           initialSort={{field: 'BinLocation', ascending: true}}>
            <SalesOrderContext value={value}>{children}</SalesOrderContext>
        </DataTableProvider>
    )
}
