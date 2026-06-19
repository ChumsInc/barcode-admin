import {useCustomerSettings} from "@/components/customer/hooks/useCustomerSettings.ts";
import {useAppSelector} from "@/app/configureStore.ts";
import {selectCustomers} from "@/ducks/customers";
import Alert from "react-bootstrap/esm/Alert";
import {customerKey} from "@/utils/customer.ts";
import {useEditorContext} from "@/hooks/editor/useEditorContext.ts";
import type {BarcodeCustomerSettings} from "chums-types";

export default function CustomerExistsAlert() {
    const {customerExists} = useCustomerSettings();
    const {value} = useEditorContext<BarcodeCustomerSettings>();
    const customerList = useAppSelector(selectCustomers);
    const matching = customerList.find(c => customerKey(c) === customerKey(value));
    if (!customerExists || !matching) {
        return null;
    }
    return (
        <Alert variant="danger">
            <strong className="me-3">Heads Up!</strong>
            {matching.CustomerName} ({customerKey(matching)}) already exists in Barcode Admin.
        </Alert>
    )
}
