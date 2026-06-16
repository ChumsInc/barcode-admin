import {createContext} from "react";
import type {BarcodeCustomerSettings} from "chums-types";

export interface CustomerSettingsContextData {
    status: 'idle'|'loading'|'saving'|'rejected';
    customerExists: boolean;
    save: (settings:BarcodeCustomerSettings) => void;
    load: (id:number) => void;
}
const CustomerSettingsContext = createContext<CustomerSettingsContextData | null>(null);
export default CustomerSettingsContext;
