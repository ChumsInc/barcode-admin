import {
    BarcodeCustomerList,
    BarcodeCustomerResponse,
    BarcodeItemList,
    ColorUPCRecord,
    CustomUPCBarcodeItem,
    SearchCustomer
} from "../types";
import {fetchJSON} from "@chumsinc/ui-utils";
import {BarcodeCustomer, BarcodeCustomerSettings, BarcodeItem} from "chums-types";
import {customerKey, itemKey} from "../utils/customer";

export async function fetchCustomers(): Promise<BarcodeCustomerList> {
    try {
        const url = `/api/operations/barcodes/customers.json`;
        const res = await fetchJSON<{ result?: BarcodeCustomer[] }>(url);
        const list: BarcodeCustomerList = {};
        res?.result?.forEach(row => {
            list[customerKey(row)] = row;
        });
        return list;
    } catch (err: unknown) {
        if (err instanceof Error) {
            console.debug("loadCustomers()", err.message);
            return Promise.reject(err);
        }
        console.debug("loadCustomers()", err);
        return Promise.reject(new Error('Error in loadCustomers()'));
    }
}

export async function fetchCustomer(customerId: number | string | null): Promise<BarcodeCustomerResponse> {
    try {
        if (!customerId) {
            return {settings: null};
        }
        const [settings, items] = await Promise.all([fetchCustomerSettings(customerId), fetchCustomerItems(customerId)]);
        return {
            settings,
            items,
        }
    } catch (err: unknown) {
        if (err instanceof Error) {
            console.debug("fetchCustomer()", err.message);
            return Promise.reject(err);
        }
        console.debug("fetchCustomer()", err);
        return Promise.reject(new Error('Error in fetchCustomer()'));
    }
}

export async function fetchCustomerSettings(customerId: number | string): Promise<BarcodeCustomerSettings | null> {
    try {
        const url = '/api/operations/barcodes/customers/:id.json'.replace(':id', encodeURIComponent(customerId));
        const res = await fetchJSON<{ result: BarcodeCustomerSettings[] }>(url);
        const [settings] = res?.result ?? [];
        if (settings) {
            settings.reqAltItemNumber = Boolean(settings.reqAltItemNumber);
            settings.reqItemDescription = Boolean(settings.reqItemDescription);
            settings.reqColor = Boolean(settings.reqColor);
            settings.reqSKU = Boolean(settings.reqSKU);
            settings.reqCustomerPart = Boolean(settings.reqCustomerPart);
            settings.reqUPC = Boolean(settings.reqUPC);
            settings.reqMSRP = Boolean(settings.reqMSRP);
            settings.reqCustom1 = Boolean(settings.reqCustom1);
            settings.reqCustom2 = Boolean(settings.reqCustom2);
            settings.reqCustom3 = Boolean(settings.reqCustom3);
            settings.reqCustom4 = Boolean(settings.reqCustom4);
        }
        return settings ?? null;
    } catch (err: unknown) {
        if (err instanceof Error) {
            console.debug("loadCustomer()", err.message);
            return Promise.reject(err);
        }
        console.debug("loadCustomer()", err);
        return Promise.reject(new Error('Error in loadCustomer()'));
    }
}

export async function postCustomerSettings(customer: BarcodeCustomer): Promise<BarcodeCustomerSettings | null> {
    try {
        const url = customer.id
            ? '/api/operations/barcodes/customers/:id.json'.replace(':id', encodeURIComponent(customer.id))
            : '/api/operations/barcodes/customers.json';
        const body = JSON.stringify(customer);
        const method = customer.id ? 'PUT' : 'POST';
        const res = await fetchJSON<{ result: BarcodeCustomerSettings[] }>(url, {method, body});
        const [settings] = res?.result ?? [];
        return settings ?? null;
    } catch (err: unknown) {
        if (err instanceof Error) {
            console.debug("postCustomerSettings()", err.message);
            return Promise.reject(err);
        }
        console.debug("postCustomerSettings()", err);
        return Promise.reject(new Error('Error in postCustomerSettings()'));
    }
}

const buildItemList = (items: BarcodeItem[]): BarcodeItemList => {
    const list: BarcodeItemList = {};
    items.forEach(row => {
        list[itemKey(row)] = row;
    })
    return list;

}

export async function fetchCustomerItems(customerId: number | string): Promise<BarcodeItemList> {
    try {
        const url = '/api/operations/barcodes/customers/:customer_id/items.json'
            .replace(':customer_id', encodeURIComponent(customerId));
        const res = await fetchJSON<{ result?: BarcodeItem[] }>(url);
        return buildItemList(res?.result ?? []);
    } catch (err: unknown) {
        if (err instanceof Error) {
            console.debug("loadCustomer()", err.message);
            return Promise.reject(err);
        }
        console.debug("loadCustomer()", err);
        return Promise.reject(new Error('Error in loadCustomer()'));
    }
}

export async function postCustomerItem(item: BarcodeItem): Promise<BarcodeItemList> {
    try {
        if (!item.CustomerID) {
            return Promise.reject(new Error('Item is missing customerId'));
        }
        const url = (
            item.ID
                ? '/api/operations/barcodes/customers/:customer_id/items/:item_id.json'
                : '/api/operations/barcodes/customers/:customer_id/items.json'
        )
            .replace(':customer_id', encodeURIComponent(item.CustomerID))
            .replace(':item_id', encodeURIComponent(item.ID ?? 0));
        const method = item.ID ? 'PUT' : 'POST';
        const body = JSON.stringify({...item, ItemDescription: item.ItemDescription.trim()})
        const res = await fetchJSON<{ result?: BarcodeItem[] }>(url, {method, body});
        return buildItemList(res?.result ?? []);
    } catch (err: unknown) {
        if (err instanceof Error) {
            console.debug("loadCustomer()", err.message);
            return Promise.reject(err);
        }
        console.debug("loadCustomer()", err);
        return Promise.reject(new Error('Error in loadCustomer()'));
    }
}

export async function deleteCustomerItem(item: BarcodeItem): Promise<BarcodeItemList> {
    try {
        if (!item.CustomerID || !item.ID) {
            return Promise.reject(new Error('Item is missing customerId or itemId'));
        }
        const url = '/api/operations/barcodes/customers/:customer_id/items/:item_id.json'
            .replace(':customer_id', encodeURIComponent(item.CustomerID))
            .replace(':item_id', encodeURIComponent(item.ID));
        const res = await fetchJSON<{ result?: BarcodeItem[] }>(url, {method: 'DELETE'});
        return buildItemList(res?.result ?? []);
    } catch (err: unknown) {
        if (err instanceof Error) {
            console.debug("deleteCustomerItem()", err.message);
            return Promise.reject(err);
        }
        console.debug("deleteCustomerItem()", err);
        return Promise.reject(new Error('Error in deleteCustomerItem()'));
    }
}

export async function fetchCustomerLookup(search: string): Promise<SearchCustomer[]> {
    try {
        if (search === '') {
            return [];
        }
        const url = `/api/search/customer/chums/:search`
            .replace(':search', encodeURIComponent(search));
        const res = await fetchJSON<{ result: SearchCustomer[] }>(url);
        return res?.result ?? [];
    } catch (err: unknown) {
        if (err instanceof Error) {
            console.debug("getCustomerLookup()", err.message);
            return Promise.reject(err);
        }
        console.debug("getCustomerLookup()", err);
        return Promise.reject(new Error('Error in getCustomerLookup()'));
    }
}

export async function postGenNextUPC(item: CustomUPCBarcodeItem, notes: string): Promise<ColorUPCRecord | null> {
    try {
        const resNextUPC = await fetchJSON<{
            nextUPC: string
        }>('/api/operations/sku/by-color/next', {cache: 'no-cache'});
        const resColorUPC = await fetchJSON<{ colorUPC: ColorUPCRecord }>('/api/operations/sku/by-color', {
            method: 'POST',
            body: JSON.stringify({
                company: 'chums',
                ItemCode: item.customItemCode ?? item.ItemCode,
                upc: resNextUPC?.nextUPC,
                notes
            })
        });
        return resColorUPC?.colorUPC ?? null;
    } catch (err: unknown) {
        if (err instanceof Error) {
            console.debug("postGenNextUPC()", err.message);
            return Promise.reject(err);
        }
        console.debug("postGenNextUPC()", err);
        return Promise.reject(new Error('Error in postGenNextUPC()'));
    }
}
