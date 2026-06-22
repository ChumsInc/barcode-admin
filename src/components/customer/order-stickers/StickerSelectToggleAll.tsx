import {type ChangeEvent, useId} from 'react';
import FormCheck from "react-bootstrap/FormCheck";
import {useOrderStickers} from "@/components/customer/order-stickers/useOrderStickers.ts";
import {isAllChecked} from "@/components/customer/order-stickers/utils.ts";

const StickerSelectToggleAll = () => {
    const {detail, setAllChecked} = useOrderStickers();
    const allChecked = isAllChecked(detail);
    const id = useId();

    const changeHandler = (ev: ChangeEvent<HTMLInputElement>) => {
        setAllChecked(ev.target.checked);
    }

    return (
        <FormCheck type={"checkbox"} aria-label="Sticker Selected" id={id} checked={!!allChecked}
                   onChange={changeHandler}/>
    )
}

export default StickerSelectToggleAll;
