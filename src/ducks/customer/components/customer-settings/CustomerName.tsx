import {useEditorContext} from "@/hooks/editor/useEditorContext.ts";
import type {BarcodeCustomerSettings} from "chums-types";
import {customerKey} from "@/utils/customer.ts";

export default function CustomerName() {
    const {value} = useEditorContext<BarcodeCustomerSettings>();
    if (!value || !value.CustomerNo) {
        return (
            <h2>New Customer</h2>
        );
    }
    return (
        <h2>{value.CustomerName} ({customerKey(value)})</h2>
    );
}
