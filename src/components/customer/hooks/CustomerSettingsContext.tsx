import {createContext} from "react";
import type {BarcodeCustomerSettings} from "chums-types";
import type {CustomerSettingsState} from "@/ducks/customer/customerSettingsSlice.ts";

export interface CustomerSettingsContextData {
    status: CustomerSettingsState['status'];
    customerExists: boolean;
    save: (settings:BarcodeCustomerSettings) => void;
    load: (id:number) => void;
}
const CustomerSettingsContext = createContext<CustomerSettingsContextData | null>(null);
export default CustomerSettingsContext;
