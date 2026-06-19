import React, {useId} from 'react';
import type {BarcodeItem} from "chums-types";
import {itemSettingsMap} from "@/utils/customer.ts";
import {Col, Form, FormControl, type FormControlProps, Row} from "react-bootstrap";
import InputGroup from "react-bootstrap/InputGroup";
import {useCustomerItems} from "@/components/customer/items/useCustomerItems.ts";

export interface ItemInputProps extends Omit<FormControlProps, 'children'> {
    field: keyof BarcodeItem;
    label: string;
    helpText?: string;
    children?: React.ReactNode;
}

export default function ItemInput({
                                      field,
                                      value,
                                      label,
                                      onChange,
                                      helpText,
                                      children,
                                      id,
                                      ...inputProps
                                  }: ItemInputProps) {
    const {customerSettings, canEdit} = useCustomerItems();
    const inputId = useId();
    const settingsKey = itemSettingsMap[field];

    if (!settingsKey || !customerSettings?.[settingsKey]) {
        return null;
    }

    return (
        <Form.Group as={Row}>
            <Form.Label column sm={4} htmlFor={id ?? inputId}>{label}</Form.Label>
            <Col sm={8}>
                <InputGroup size="sm">
                    <FormControl size="sm" value={value} onChange={onChange}
                                 id={id ?? inputId}
                                 {...inputProps}
                                 readOnly={!canEdit}/>
                    {children}
                </InputGroup>
                {!!helpText && <small className="text-secondary">{helpText}</small>}
            </Col>
        </Form.Group>
    )
}

