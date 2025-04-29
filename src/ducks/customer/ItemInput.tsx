import React, {InputHTMLAttributes} from 'react';
import {BarcodeItem} from "chums-types";
import {useSelector} from "react-redux";
import {selectCurrentCustomer} from "./selectors";
import {itemSettingsMap} from "../../utils/customer";
import {selectCanEdit} from "../user";
import {Col, Form, FormControl, FormControlProps, Row} from "react-bootstrap";
import InputGroup from "react-bootstrap/InputGroup";



export interface ItemInputProps extends Omit<FormControlProps, 'children'> {
    field: keyof BarcodeItem;
    label: string;
    helpText?: string;
    children?: React.ReactNode;
}

const ItemInput = ({field, value, label, onChange, helpText, children, ...inputProps}: ItemInputProps) => {
    const settings = useSelector(selectCurrentCustomer);
    const canEdit = useSelector(selectCanEdit);
    const settingsKey = itemSettingsMap[field];
    if (!settings || !settingsKey || !settings[settingsKey]) {
        return null;
    }


    return (
        <Form.Group as={Row}>
            <Form.Label column sm={4}>{label}</Form.Label>
            <Col sm={8}>
                <InputGroup size="sm">
                    <FormControl size="sm" value={value} onChange={onChange}  {...inputProps}
                           readOnly={!canEdit}/>
                    {children}
                </InputGroup>
                {!!helpText && <small className="text-secondary">{helpText}</small>}
            </Col>
        </Form.Group>
    )
}

export default ItemInput;
