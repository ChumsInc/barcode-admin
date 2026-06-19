import {useAppSelector} from "@/app/configureStore.ts";
import EditorProvider from "@/hooks/editor/EditorProvider.tsx";
import {newCustomer} from "@/ducks/customers/utils.ts";
import CustomerSettings from "@/components/customer/editor/CustomerSettings.tsx";
import CustomerSettingsProvider from "@/components/customer/hooks/CustomerSettingsProvider.tsx";
import {selectCustomerSettings} from "@/ducks/customer/customerSettingsSlice.ts";

export default function CustomerSettingsEditContainer() {
    const customer = useAppSelector(selectCustomerSettings);
    return (
        <EditorProvider initialValue={customer ?? {...newCustomer}}>
            <CustomerSettingsProvider>
                <CustomerSettings/>
            </CustomerSettingsProvider>
        </EditorProvider>
    )
}
