import {SalesOrder} from 'chums-types';
import {fetchJSON} from "chums-components";
import {GenerateStickerBody, GenerateStickerProps} from "../types";

export async function fetchSalesOrder(salesOrderNo: string): Promise<SalesOrder | null> {
    try {
        const url = `/node-sage/api/CHI/salesorder/${encodeURIComponent(salesOrderNo)}`
        const res = await fetchJSON<{ result: SalesOrder[] }>(url);
        return res?.result[0] ?? null;
    } catch (err: unknown) {
        if (err instanceof Error) {
            console.debug("fetchSalesOrder()", err.message);
            return Promise.reject(err);
        }
        console.debug("fetchSalesOrder()", err);
        return Promise.reject(new Error('Error in fetchSalesOrder()'));
    }
}


export async function postOrderStickers({
                                            customerId,
                                            SalesOrderNo,
                                            CustomerPONo,
                                            lines,
                                            reversed
                                        }: GenerateStickerProps): Promise<number> {
    try {
        const url = `/api/operations/barcodes/customers/:customer_id/so/:SalesOrderNo.json`
            .replace(':customer_id', encodeURIComponent(customerId))
            .replace(':SalesOrderNo', encodeURIComponent(SalesOrderNo))
        const body: GenerateStickerBody = {
            lines,
            CustomerPONo,
            reversed
        }
        const res = await fetchJSON<{ result: number }>(url, {method: 'POST', body: JSON.stringify(body)});
        return res?.result ?? 0;
    } catch (err: unknown) {
        if (err instanceof Error) {
            console.debug("postOrderStickers()", err.message);
            return Promise.reject(err);
        }
        console.debug("postOrderStickers()", err);
        return Promise.reject(new Error('Error in postOrderStickers()'));
    }
}

export async function fetchSOSearch(salesOrderNo: string): Promise<SalesOrder | null> {
    try {
        const url = `/api/sales/orders/chums/${encodeURIComponent(salesOrderNo)}`;
        const res = await fetchJSON<{ salesOrder: SalesOrder }>(url, {cache: 'no-cache'});
        return res?.salesOrder ?? null;
    } catch (err: unknown) {
        if (err instanceof Error) {
            console.debug("fetchSOSearch()", err.message);
            return Promise.reject(err);
        }
        console.debug("fetchSOSearch()", err);
        return Promise.reject(new Error('Error in fetchSOSearch()'));
    }
}
