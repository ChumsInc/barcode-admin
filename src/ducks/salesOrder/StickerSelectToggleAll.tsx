import React, {ChangeEvent, useId} from 'react';
import {useSelector} from "react-redux";
import {selectIsAllSelected} from "./selectors";
import {useAppDispatch} from "../../app/configureStore";
import {toggleAllSelected} from "./actions";
import FormCheck from "react-bootstrap/FormCheck";

const StickerSelectToggleAll = () => {
    const dispatch = useAppDispatch();
    const checked = useSelector(selectIsAllSelected);
    const id = useId();

    const changeHandler = (ev: ChangeEvent<HTMLInputElement>) => {
        dispatch(toggleAllSelected(ev.target.checked));
    }

    return (
        <FormCheck type={"checkbox"} aria-label="Sticker Selected" id={id} checked={checked} onChange={changeHandler}/>
    )
}

export default StickerSelectToggleAll;
