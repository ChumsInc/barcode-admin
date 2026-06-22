import {type ChangeEvent} from 'react';
import {useOrderStickers} from "@/components/customer/order-stickers/useOrderStickers.ts";

export interface StickerQuantityInputProps {
    lineKey: string;
    stickerQty: number | null;
    disabled: boolean;

}

const StickerQuantityInput = ({lineKey, stickerQty, disabled}: StickerQuantityInputProps) => {
    const {setLineStickerQty} = useOrderStickers();

    const changeHandler = (ev: ChangeEvent<HTMLInputElement>) => {
        if (disabled) {
            return;
        }
        setLineStickerQty(lineKey, ev.target.valueAsNumber);
    }

    return (
        <input type="number" value={stickerQty ?? ''} onChange={changeHandler} min={0}
               disabled={disabled} readOnly={disabled}
               style={{maxWidth: '6rem'}}
               className="form-control form-control-sm text-end"/>
    )
}

export default StickerQuantityInput;
