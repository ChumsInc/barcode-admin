import {UserValidationResponse} from "../types";
import {fetchJSON} from "@chumsinc/ui-utils";

export async function fetchUserValidation():Promise<UserValidationResponse|null> {
    try {
        const url = '/api/user/validate';
        return await fetchJSON<UserValidationResponse>(url);
    } catch(err:unknown) {
        return {
            valid: false,
            loaded: new Date().toISOString()
        }
    }
}
