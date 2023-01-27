import {UserValidationResponse} from "../types";
import {fetchJSON} from "chums-components/dist/fetch";

export async function fetchUserValidation():Promise<UserValidationResponse> {
    try {
        const url = '/api/user/validate';
        return await fetchJSON<UserValidationResponse>(url);
    } catch(err:unknown) {
        if (err instanceof Error) {
            console.debug("fetchUserValidation()", err.message);
            return Promise.reject(err);
        }
        console.debug("fetchUserValidation()", err);
        return Promise.reject(new Error('Error in fetchUserValidation()'));
    }
}
