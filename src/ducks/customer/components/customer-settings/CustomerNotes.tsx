import {useEditorContext} from "@/hooks/editor/useEditorContext.ts";
import type {BarcodeCustomerSettings} from "chums-types";
import {type ChangeEvent, useId} from "react";
import TextArea from "@chumsinc/textarea";
import {useAppSelector} from "@/app/configureStore.ts";
import {selectCanEdit} from "@/ducks/user";
import {Badge, FormText} from "react-bootstrap";

export default function CustomerNotes() {
    const {value, updateValue} = useEditorContext<BarcodeCustomerSettings>();
    const canEdit = useAppSelector(selectCanEdit);
    const id = useId();

    const changeHandler = (ev: ChangeEvent<HTMLTextAreaElement>) => {
        updateValue({Notes: ev.target.value});
    }

    return (
        <div>
            <label className="form-label" htmlFor={id}>
                <span className="me-2">
                    Notes
                </span>
                <Badge pill bg="info" className="me-2" role="presentation">
                    <span className="bi-card-text"/>
                </Badge>
            </label>
            <TextArea minRows={3} maxRows={10} value={value.Notes ?? ''}
                      readOnly={!canEdit}
                      className="form-control form-control-sm"
                      onChange={changeHandler}/>
            <FormText muted>Best used for notes for maintaining this customer.</FormText>
        </div>
    )

}
