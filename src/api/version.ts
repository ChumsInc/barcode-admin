import {fetchJSON} from "@chumsinc/ui-utils";

export async function fetchVersion():Promise<string|null> {
    try {
        const res = await fetchJSON<{version: string}>('package.json');
        return res?.version ?? null;
    } catch(err:unknown) {
        if (err instanceof Error) {
            console.debug("fetchVersion()", err.message);
            return Promise.reject(err);
        }
        console.debug("fetchVersion()", err);
        return Promise.reject(new Error('Error in fetchVersion()'));
    }
}
