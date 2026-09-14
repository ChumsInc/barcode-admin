import type {UserValidationResponse} from "../types";
import {fetchJSON} from "@chumsinc/ui-utils";

export async function fetchUserValidation():Promise<UserValidationResponse|null> {
    try {
        const url = '/api/user/v2/validate.json';
        return await fetchJSON<UserValidationResponse>(url);
    } catch(_err:unknown) {
        return {
            valid: false,
            loaded: new Date().toISOString()
        }
    }
}
