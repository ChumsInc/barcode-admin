import {SageItem} from "../types";
import {fetchJSON} from "chums-components/dist/fetch";

export async function fetchItemInfo(itemCode: string):Promise<SageItem|null> {
    try {
        const url = '/api/operations/production/item/info/chums/:itemCode'
            .replace(':itemCode', encodeURIComponent(itemCode));
        const res = await fetchJSON<{item: SageItem}>(url, {cache: 'default'});
        return res.item ?? null;
    } catch(err:unknown) {
        if (err instanceof Error) {
            console.debug("loadItemInfo()", err.message);
            return Promise.reject(err);
        }
        console.debug("loadItemInfo()", err);
        return Promise.reject(new Error('Error in loadItemInfo()'));
    }
}

export async function fetchItemLookup(search:string):Promise<SageItem[]> {
    try {
        const url = '/api/search/item/chums/:search'
            .replace(':search', encodeURIComponent(search));
        const {result} = await fetchJSON<{result: SageItem[]}>(url);
        return result;
    } catch(err:unknown) {
        if (err instanceof Error) {
            console.debug("fetchItemLookup()", err.message);
            return Promise.reject(err);
        }
        console.debug("fetchItemLookup()", err);
        return Promise.reject(new Error('Error in fetchItemLookup()'));
    }
}
