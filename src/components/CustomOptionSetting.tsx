import React, {ChangeEvent, useId} from 'react';
import {useSelector} from "react-redux";
import {selectCanEdit} from "@/ducks/user";
import InputGroup from "react-bootstrap/InputGroup";
import {FormControl} from "react-bootstrap";

export interface CustomOptionSettingProps {
    name: string;
    required: boolean;
    onChangeRequired: (checked: boolean) => void;
    value: string;
    onChangeValue: (ev: ChangeEvent<HTMLInputElement>) => void;
}

const CustomOptionSetting = ({name, required, onChangeRequired, value, onChangeValue}: CustomOptionSettingProps) => {
    const canEdit = useSelector(selectCanEdit);
    const id = useId();
    return (
        <InputGroup size="sm">
            <InputGroup.Text>{name}</InputGroup.Text>
            <InputGroup.Checkbox id={id} aria-label={name} readOnly={!canEdit}
                                 checked={required} onChange={(ev) => onChangeRequired(ev.target.checked)}/>
            <FormControl type="text" size="sm" disabled={!canEdit}
                         readOnly={!required} placeholder={name} value={value} onChange={onChangeValue}/>
        </InputGroup>
    )
}

export default CustomOptionSetting;
