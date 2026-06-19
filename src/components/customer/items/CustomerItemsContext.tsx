import { createContext } from 'react';
import type {BarcodeCustomerSettings, BarcodeItem} from "chums-types";
import type {SortableTableField} from "@chumsinc/sortable-tables";

export interface CustomerItemsContextProps {
    customerSettings: BarcodeCustomerSettings|null;
    fields: SortableTableField<BarcodeItem>[];
    items: BarcodeItem[];
    currentItem: BarcodeItem | null;
    setCurrentItem: (item: BarcodeItem | null) => void;
    canEdit: boolean;
    canAssignNewUPC: boolean;
}

const CustomerItemsContext = createContext<CustomerItemsContextProps | null>(null);
export default CustomerItemsContext;
