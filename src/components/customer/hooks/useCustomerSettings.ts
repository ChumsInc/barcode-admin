import {useContext} from "react";
import CustomerSettingsContext, {
    type CustomerSettingsContextData
} from "@/components/customer/hooks/CustomerSettingsContext.tsx";

export function useCustomerSettings() {
    const context = useContext(CustomerSettingsContext) as CustomerSettingsContextData|null;
    if (!context) {
        throw new Error("useCustomerSettings must be used within a CustomerSettingsProvider");
    }
    return context;
}
