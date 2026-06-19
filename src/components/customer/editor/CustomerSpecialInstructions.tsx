import {useEditorContext} from "@/hooks/editor/useEditorContext.ts";
import type {BarcodeCustomerSettings} from "chums-types";
import {type ChangeEvent, useId} from "react";
import TextArea from "@chumsinc/textarea";
import {useAppSelector} from "@/app/configureStore.ts";
import {selectCanEdit} from "@/ducks/user";
import {FormText, Badge} from "react-bootstrap";


export default function CustomerSpecialInstructions() {
    const {value, updateValue} = useEditorContext<BarcodeCustomerSettings>();
    const canEdit = useAppSelector(selectCanEdit);
    const id = useId();

    const changeHandler = (ev: ChangeEvent<HTMLTextAreaElement>) => {
        updateValue({SpecialInstructions: ev.target.value});
    }

    return (
        <div>
            <label className="form-label" htmlFor={id}>
                <span className="me-2">
                    Special Instructions
                </span>
                <Badge bg="warning" pill role="presentation">
                    <span className="bi-card-text"/>
                </Badge>
            </label>
            <TextArea minRows={3} maxRows={10} value={value.SpecialInstructions ?? ''}
                      readOnly={!canEdit}
                      className="form-control form-control-sm"
                      onChange={changeHandler}/>
            <FormText muted>
                Best used for instructions when printing stickers, etc.
            </FormText>
        </div>
    )

}
