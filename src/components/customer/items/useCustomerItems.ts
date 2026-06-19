import {useContext} from "react";
import CustomerItemsContext from "@/components/customer/items/CustomerItemsContext.tsx";

export function useCustomerItems() {
    const customerItems = useContext(CustomerItemsContext);
    if (!customerItems) {
        throw new Error("useCustomerItems must be used within a CustomerItemsProvider");
    }
    return customerItems;
}
