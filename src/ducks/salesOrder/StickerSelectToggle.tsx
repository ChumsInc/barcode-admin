import React, {ChangeEvent} from 'react';
import {useSelector} from "react-redux";
import {selectSalesOrderDetail} from "./selectors";
import {FormCheck} from "chums-components";
import {useAppDispatch} from "../../app/configureStore";
import {toggleLineSelected} from "./actions";

export interface StickerSelectToggleProps {
    lineKey: string;
}

const StickerSelectToggle = ({lineKey}: StickerSelectToggleProps) => {
    const dispatch = useAppDispatch();
    const detail = useSelector(selectSalesOrderDetail);

    const [row] = detail.filter(row => row.ItemType === '1' && row.LineKey === lineKey);

    const changeHandler = (ev: ChangeEvent<HTMLInputElement>) => dispatch(toggleLineSelected({
        lineKey,
        forced: ev.target.checked
    }));

    return (
        <FormCheck type={"checkbox"} label={""} checked={row?.selected} onChange={changeHandler}
                   disabled={!row || !row.item}/>
    )
}

export default StickerSelectToggle;
