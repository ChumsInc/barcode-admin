import {UserValidationResponse} from "../types";
import {fetchJSON} from "chums-components/dist/fetch";

export async function fetchUserValidation():Promise<UserValidationResponse> {
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
