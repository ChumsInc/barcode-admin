import {UserValidationResponse} from "../types";
import {fetchJSON} from "chums-components";

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
