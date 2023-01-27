import React, {ChangeEvent} from 'react';
import {useSelector} from "react-redux";
import {selectCanEdit} from "../ducks/user";

export interface CustomOptionSettingProps {
    name: string;
    required: boolean;
    onChangeRequired: (checked: boolean) => void;
    value: string;
    onChangeValue: (ev: ChangeEvent<HTMLInputElement>) => void;
}

const CustomOptionSetting = ({name, required, onChangeRequired, value, onChangeValue}: CustomOptionSettingProps) => {
    const canEdit = useSelector(selectCanEdit);
    return (
        <div className="input-group input-group-sm">
            <div className="input-group-text">{name}</div>
            <div className="input-group-text">
                <input type="checkbox" className="form-check-input mt-0" readOnly={!canEdit}
                       checked={required} onChange={(ev) => onChangeRequired(ev.target.checked)}/>
            </div>
            <input type="text" className="form-control form-control-sm" disabled={!canEdit}
                   readOnly={!required} placeholder={name} value={value} onChange={onChangeValue}/>
        </div>
    )
}

export default CustomOptionSetting;
