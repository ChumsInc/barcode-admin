import {type ChangeEvent, useId} from 'react';
import {useSelector} from "react-redux";
import {selectIsAllSelected} from "@/ducks/salesOrder/selectors.ts";
import {useAppDispatch} from "@/app/configureStore.ts";
import {toggleAllSelected} from "@/ducks/salesOrder/actions.ts";
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
