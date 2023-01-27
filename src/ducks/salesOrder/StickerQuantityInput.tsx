import React, {ChangeEvent} from 'react';
import {useAppDispatch} from "../../app/configureStore";
import {setLineQty} from "./actions";

export interface StickerQuantityInputProps {
    lineKey: string;
    stickerQty: number | null;
    disabled: boolean;

}

const StickerQuantityInput = ({lineKey, stickerQty, disabled}: StickerQuantityInputProps) => {
    const dispatch = useAppDispatch();

    const changeHandler = (ev: ChangeEvent<HTMLInputElement>) => {
        if (disabled) {
            return;
        }
        dispatch(setLineQty({lineKey, qty: ev.target.valueAsNumber}));
    }

    return (
        <input type="number" value={stickerQty ?? ''} onChange={changeHandler} min={0}
               disabled={disabled} readOnly={disabled}
               style={{maxWidth: '6rem'}}
               className="form-control form-control-sm text-end"/>
    )
}

export default StickerQuantityInput;
