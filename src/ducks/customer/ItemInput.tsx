import React, {InputHTMLAttributes} from 'react';
import {BarcodeItem} from "chums-types";
import {FormColumn} from "chums-components";
import {useSelector} from "react-redux";
import {selectCurrentCustomer} from "./selectors";
import {itemSettingsMap} from "../../utils/customer";
import {selectCanEdit} from "../user";


export interface ItemInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'children'> {
    field: keyof BarcodeItem;
    label: string;
    children?: React.ReactNode;
}

const ItemInput = ({field, value, label, onChange, children, ...inputProps}: ItemInputProps) => {
    const settings = useSelector(selectCurrentCustomer);
    const canEdit = useSelector(selectCanEdit);
    const settingsKey = itemSettingsMap[field];
    if (!settings || !settingsKey || !settings[settingsKey]) {
        return null;
    }


    return (
        <FormColumn label={label}>
            <div className="input-group input-group-sm">
                <input value={value} onChange={onChange} className="form-control form-control-sm" {...inputProps}
                       readOnly={!canEdit}/>
                {children}
            </div>
        </FormColumn>
    )
}

export default ItemInput;
