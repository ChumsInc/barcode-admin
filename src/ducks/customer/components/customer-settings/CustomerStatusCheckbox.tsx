import {useEditorContext} from "@/hooks/editor/useEditorContext.ts";
import type {BarcodeCustomerSettings} from "chums-types";
import {useSelector} from "react-redux";
import {selectCanEdit} from "@/ducks/user";
import {type ChangeEvent, useId} from "react";
import FormCheck from "react-bootstrap/esm/FormCheck";

export default function CustomerStatusCheckbox() {
    const {value, updateValue} = useEditorContext<BarcodeCustomerSettings>();
    const canEdit = useSelector(selectCanEdit);
    const id = useId();

    const changeHandler = (ev: ChangeEvent<HTMLInputElement>) => {
        updateValue({active: ev.target.checked});
    }

    return (
        <FormCheck type="checkbox" label="Active Customer" id={id}
                   checked={value.active} readOnly={!canEdit}
                   onChange={changeHandler}
        />
    )
}
