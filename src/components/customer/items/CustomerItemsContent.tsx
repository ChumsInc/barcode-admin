import {getCustomerColumns} from "@/components/customer/items/list/CustomerItemListFields.tsx";
import {DataTableProvider} from "@chumsinc/sortable-tables";
import CustomerItems from "@/components/customer/items/CustomerItems.tsx";
import CustomerItemsProvider from "@/components/customer/items/CustomerItemsProvider.tsx";
import {useSelector} from "react-redux";
import {selectItemSort} from "@/ducks/customer/customerItemsSlice.ts";

export default function CustomerItemsContent() {
    const sort = useSelector(selectItemSort);
    return (
        <DataTableProvider initialFields={getCustomerColumns(null)} initialSort={sort}>
            <CustomerItemsProvider>
                <CustomerItems/>
            </CustomerItemsProvider>
        </DataTableProvider>
    )
}
