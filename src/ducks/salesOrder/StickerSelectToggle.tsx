import {type ChangeEvent, useId} from 'react';
import {useSelector} from "react-redux";
import {selectSalesOrderDetail} from "./selectors";
import FormCheck from "react-bootstrap/FormCheck";
import {useAppDispatch} from "@/app/configureStore";
import {toggleLineSelected} from "./actions";

export interface StickerSelectToggleProps {
    lineKey: string;
}

const StickerSelectToggle = ({lineKey}: StickerSelectToggleProps) => {
    const dispatch = useAppDispatch();
    const detail = useSelector(selectSalesOrderDetail);
    const id = useId();

    const [row] = detail.filter(row => row.ItemType === '1' && row.LineKey === lineKey);

    const changeHandler = (ev: ChangeEvent<HTMLInputElement>) => dispatch(toggleLineSelected({
        lineKey,
        forced: ev.target.checked
    }));

    return (
        <FormCheck type={"checkbox"} id={id}
                   aria-lable="Row Selected" checked={row?.selected} onChange={changeHandler}
                   disabled={!row || !row.item}/>
    )
}

export default StickerSelectToggle;
