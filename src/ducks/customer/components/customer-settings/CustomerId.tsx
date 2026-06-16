import {useEditorContext} from "@/hooks/editor/useEditorContext.ts";
import type {BarcodeCustomerSettings} from "chums-types";
import InputGroup from "react-bootstrap/esm/InputGroup";
import {FormControl} from "react-bootstrap";
import {useId} from "react";

export default function CustomerId() {
    const {value} = useEditorContext<BarcodeCustomerSettings>()
    const id = useId();
    return (
        <InputGroup size="sm">
            <InputGroup.Text as="label" htmlFor={id}>ID</InputGroup.Text>
            <FormControl size="sm" readOnly={true} id={id} value={value.id || 'NEW'}/>
        </InputGroup>
    )
}
