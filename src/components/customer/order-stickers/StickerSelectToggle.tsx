import {type ChangeEvent, useId} from 'react';
import FormCheck from "react-bootstrap/FormCheck";
import {useOrderStickers} from "@/components/customer/order-stickers/useOrderStickers.ts";

export interface StickerSelectToggleProps {
    lineKey: string;
}

const StickerSelectToggle = ({lineKey}: StickerSelectToggleProps) => {
    const {detail, setLineChecked} = useOrderStickers();
    const id = useId();

    const [row] = detail.filter(row => row.ItemType === '1' && row.LineKey === lineKey);

    const changeHandler = (ev: ChangeEvent<HTMLInputElement>) => {
        setLineChecked(lineKey, ev.target.checked);
    }

    return (
        <FormCheck type={"checkbox"} id={id}
                   aria-lable="Row Selected" checked={row?.selected} onChange={changeHandler}
                   disabled={!row || !row.item}/>
    )
}

export default StickerSelectToggle;
