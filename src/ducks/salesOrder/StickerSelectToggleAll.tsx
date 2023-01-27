import React, {ChangeEvent} from 'react';
import {useSelector} from "react-redux";
import {selectIsAllSelected} from "./selectors";
import {FormCheck} from "chums-components";
import {useAppDispatch} from "../../app/configureStore";
import {toggleAllSelected} from "./actions";

const StickerSelectToggleAll = () => {
    const dispatch = useAppDispatch();
    const checked = useSelector(selectIsAllSelected);

    const changeHandler = (ev: ChangeEvent<HTMLInputElement>) => {
        dispatch(toggleAllSelected(ev.target.checked));
    }

    return (
        <FormCheck type={"checkbox"} label={""} checked={checked} onChange={changeHandler}/>
    )
}

export default StickerSelectToggleAll;
