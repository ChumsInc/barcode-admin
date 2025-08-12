import type {SageItem} from "../types";
import {fetchJSON} from "@chumsinc/ui-utils";
import type {SearchItem} from "chums-types";

export async function fetchItemInfo(itemCode: string):Promise<SageItem|null> {
    try {
        const url = '/api/operations/production/item/info/chums/:itemCode'
            .replace(':itemCode', encodeURIComponent(itemCode));
        const res = await fetchJSON<{item: SageItem}>(url, {cache: 'default'});
        return res?.item ?? null;
    } catch(err:unknown) {
        if (err instanceof Error) {
            console.debug("loadItemInfo()", err.message);
            return Promise.reject(err);
        }
        console.debug("loadItemInfo()", err);
        return Promise.reject(new Error('Error in loadItemInfo()'));
    }
}

export async function fetchItemLookup(search:string):Promise<SearchItem[]> {
    try {
        const params = new URLSearchParams();
        params.set('search', search);
        const url = `/api/search/item.json?${params.toString()}`;
        const res = await fetchJSON<{result: SearchItem[]}>(url);
        return res?.result ?? [];
    } catch(err:unknown) {
        if (err instanceof Error) {
            console.debug("fetchItemLookup()", err.message);
            return Promise.reject(err);
        }
        console.debug("fetchItemLookup()", err);
        return Promise.reject(new Error('Error in fetchItemLookup()'));
    }
}

