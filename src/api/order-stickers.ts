import {SalesOrder} from 'chums-types';
import {fetchJSON} from "chums-components/dist/fetch";
import {BarcodeSOLineItem, GenerateStickerBody, GenerateStickerProps} from "../types";

export async function fetchSalesOrder(salesOrderNo: string): Promise<SalesOrder | null> {
    try {
        const url = `/node-sage/api/CHI/salesorder/${encodeURIComponent(salesOrderNo)}`
        const {result} = await fetchJSON<{ result: SalesOrder[] }>(url);
        return result[0] || null;
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
        const url = `/api/operations/barcodes/v2/order/gen/:customer_id/:SalesOrderNo`
            .replace(':customer_id', encodeURIComponent(customerId))
            .replace(':SalesOrderNo', encodeURIComponent(SalesOrderNo))
        const body: GenerateStickerBody = {
            lines,
            CustomerPONo,
            reversed
        }
        const {result} = await fetchJSON<{ result: number }>(url, {method: 'POST', body: JSON.stringify(body)});
        return result;
    } catch (err: unknown) {
        if (err instanceof Error) {
            console.debug("postOrderStickers()", err.message);
            return Promise.reject(err);
        }
        console.debug("postOrderStickers()", err);
        return Promise.reject(new Error('Error in postOrderStickers()'));
    }
}

export async function fetchSOSearch(salesOrderNo:string):Promise<SalesOrder|null> {
    try {
        const url = `/api/sales/orders/chums/${encodeURIComponent(salesOrderNo)}`;
        const {salesOrder} = await fetchJSON<{salesOrder: SalesOrder}>(url, {cache: 'no-cache'});
        return salesOrder ?? null;
    } catch(err:unknown) {
        if (err instanceof Error) {
            console.debug("fetchSOSearch()", err.message);
            return Promise.reject(err);
        }
        console.debug("fetchSOSearch()", err);
        return Promise.reject(new Error('Error in fetchSOSearch()'));
    }
}
