import {useEditorContext} from "@/hooks/editor/useEditorContext.ts";
import type {BarcodeItem} from "chums-types";
import type {ChangeEvent} from "react";
import {Col, Form, Row} from "react-bootstrap";
import TextArea from "@chumsinc/textarea";
import {useCustomerItems} from "@/components/customer/items/useCustomerItems.ts";

export default function SpecialInstructionsField() {
    const {value, updateValue} = useEditorContext<BarcodeItem>();
    const {canEdit} = useCustomerItems();

    const changeHandler = (ev: ChangeEvent<HTMLTextAreaElement>) => {
        if (canEdit) {
            updateValue({SpecialInstructions: ev.target.value});
        }
    }
    return (
        <Form.Group as={Row} className="mb-1">
            <Form.Label column sm={4}>Notes</Form.Label>
            <Col>
                <TextArea minRows={3} value={value.SpecialInstructions ?? ''}
                          readOnly={!canEdit}
                          className="form-control form-control-sm"
                          onChange={changeHandler}/>
            </Col>
        </Form.Group>
    )
}
