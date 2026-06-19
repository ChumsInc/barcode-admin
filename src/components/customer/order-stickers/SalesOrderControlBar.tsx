import {type ChangeEvent, useCallback, useId} from 'react';
import {useAppDispatch} from "@/app/configureStore.ts";
import {generateStickers} from "@/ducks/salesOrder/actions.ts";
import StickerQuantityGeneratedAlert from "@/components/customer/order-stickers/StickerQuantityGeneratedAlert.tsx";
import FormCheck from "react-bootstrap/FormCheck";
import {SpinnerButton} from "@chumsinc/react-bootstrap-addons";
import {useSalesOrder} from "@/components/customer/order-stickers/useSalesOrder.ts";
import {usePrintOptions} from "@/components/customer/order-stickers/usePrintOptions.ts";
import {useOrderStickers} from "@/components/customer/order-stickers/useOrderStickers.ts";

const SalesOrderControlBar = () => {
    const dispatch = useAppDispatch();
    const {salesOrderNo, loadSalesOrder, status, shipToCodes} = useSalesOrder();
    const {
        sort,
        reversed,
        setReversed,
        includeQuantity,
        setIncludeQuantity,
        shipToCode,
        setShipToCode
    } = usePrintOptions();
    const {extra, setExtra, count} = useOrderStickers();

    const listId = useId();
    const stickerVersionId = useId();
    const idPrintReversed = useId();
    const submitHandler = useCallback((data: FormData) => {
        const salesOrderNo = data.get('salesOrderNo') as string;
        if (!salesOrderNo.trim()) {
            return;
        }
        loadSalesOrder(salesOrderNo.trim().padStart(7, '0'));
    }, [loadSalesOrder])

    const handleChangeShipTo = (ev: ChangeEvent<HTMLInputElement>) => {
        setShipToCode(ev.target.value);
    }

    const handleIncludeQuantityChange = (ev: ChangeEvent<HTMLInputElement>) => {
        setIncludeQuantity(ev.target.checked);
    }

    const handleExtraChange = (ev: ChangeEvent<HTMLInputElement>) => {
        if (isNaN(ev.target.valueAsNumber)) {
            return;
        }
        setExtra(ev.target.valueAsNumber);
    }

    const handleGenerateStickers = () => {
        dispatch(generateStickers(reversed))
    }

    return (
        <div className="row g-3 align-items-baseline mt-3">
            <div className="col-auto">
                <form action={submitHandler}>
                    <div className="input-group input-group-sm">
                        <div className="input-group-text">SO#</div>
                        <input type="search" defaultValue={salesOrderNo}
                               className="form-control"
                               name="salesOrderNo"
                               maxLength={7} minLength={6}/>
                        <SpinnerButton type="submit" variant="primary" spinning={status === "loading"}
                                       size="sm">Load</SpinnerButton>
                    </div>
                </form>
            </div>
            <div className="col-auto">
                <div className="input-group input-group-sm">
                    <div className="input-group-text">Extra</div>
                    <input type="number" value={extra} className="form-control" min={0} max={100}
                           onChange={handleExtraChange}/>
                    <div className="input-group-text">%</div>
                </div>
            </div>
            <div className="col-auto">
                <div className="input-group input-group-sm">
                    <div className="input-group-text">Store</div>
                    <input type="search" className="form-control form-control-sm"
                           value={shipToCode} onChange={handleChangeShipTo} list={listId}/>
                    <datalist id={listId}>
                        {shipToCodes.map(value => (<option key={value}>{value}</option>))}'
                    </datalist>
                </div>
            </div>
            <div className="col-auto">
                Sort: <strong>{sort.field}</strong>
            </div>
            <div className="col-auto">
                <FormCheck type={"checkbox"} label={"Print Reversed"} id={idPrintReversed}
                           checked={reversed}
                           onChange={(ev) => setReversed(ev.target.checked)}/>
            </div>
            <div className="col-auto">
                <FormCheck type={"checkbox"} label={"Include quantity in sticker record"} id={stickerVersionId}
                           checked={includeQuantity}
                           onChange={handleIncludeQuantityChange}/>
            </div>
            <div className="col-auto">
                <button type="button" className="btn btn-sm btn-success" disabled={count === 0}
                        onClick={handleGenerateStickers}>
                    Generate Stickers ({count})
                </button>
            </div>
            <div className="col">
                <StickerQuantityGeneratedAlert/>
            </div>
        </div>
    )
}

export default SalesOrderControlBar;
