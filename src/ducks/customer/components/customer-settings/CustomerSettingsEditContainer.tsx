import {useAppSelector} from "@/app/configureStore.ts";
import {selectCurrentCustomer} from "@/ducks/customer/selectors.ts";
import EditorProvider from "@/hooks/editor/EditorProvider.tsx";
import {newCustomer} from "@/ducks/customers/utils.ts";
import CustomerSettings from "@/ducks/customer/components/customer-settings/CustomerSettings.tsx";
import CustomerSettingsProvider from "@/ducks/customer/components/customer-settings/CustomerSettingsProvider.tsx";

export default function CustomerSettingsEditContainer() {
    const customer = useAppSelector(selectCurrentCustomer);
    return (
        <EditorProvider initialValue={customer ?? {...newCustomer}}>
            <CustomerSettingsProvider>
                <CustomerSettings />
            </CustomerSettingsProvider>
        </EditorProvider>
    )
}
