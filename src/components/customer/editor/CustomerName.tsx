import {useEditorContext} from "@/hooks/editor/useEditorContext.ts";
import type {BarcodeCustomerSettings} from "chums-types";
import {customerKey} from "@/utils/customer.ts";
import {useAppSelector} from "@/app/configureStore.ts";
import {selectCanEdit} from "@/ducks/user";

export default function CustomerName() {
    const {value} = useEditorContext<BarcodeCustomerSettings>();
    const canEdit = useAppSelector(selectCanEdit);

    if (!value || !value.CustomerNo) {
        return (
            <h2>New Customer</h2>
        );
    }
    return (
        <div className="d-flex justify-content-start align-items-center">
            {!canEdit && (<span className="me-1 bi-lock-fill text-danger" />)}
            <h2>{value.CustomerName} ({customerKey(value)})</h2>
        </div>
    );
}
