import React, {FormEvent, useEffect, useState} from 'react';
import {useAppDispatch} from "../../app/configureStore";
import {useSelector} from "react-redux";
import {
    selectDetailSort,
    selectExtraQuantity,
    selectSalesOrderLoading,
    selectSalesOrderNo,
    selectStickerQty
} from "./selectors";
import {generateStickers, loadSalesOrder, setExtraStickers} from "./actions";
import {FormCheck, SpinnerButton} from "chums-components";
import {useSearchParams} from "react-router-dom";
import StickerQuantityGeneratedAlert from "./StickerQuantityGeneratedAlert";

const SalesOrderControlBar = () => {
    const dispatch = useAppDispatch();
    const [searchParams, setSearchParams] = useSearchParams();
    const salesOrderNo = useSelector(selectSalesOrderNo);
    const loading = useSelector(selectSalesOrderLoading);
    const extra = useSelector(selectExtraQuantity);
    const sort = useSelector(selectDetailSort);
    const count = useSelector(selectStickerQty);
    const [so, setSO] = useState(salesOrderNo);
    const [reversed, setReversed] = useState<boolean>(false);


    useEffect(() => {
        const so = searchParams.get('salesOrderNo');
        if (!!so && so !== salesOrderNo) {
            dispatch(loadSalesOrder(so.padStart(7, '0')));
        }
    }, []);

    useEffect(() => {
        setSO(salesOrderNo);
        setSearchParams({salesOrderNo});
    }, [salesOrderNo]);

    const submitHandler = (ev: FormEvent) => {
        ev.preventDefault();
        dispatch(loadSalesOrder(so.trim().padStart(7, '0')));
    }

    const handleGenerateStickers = () => {
        dispatch(generateStickers(reversed))
    }

    return (
        <div className="row g-3 align-items-baseline mt-3">
            <div className="col-auto">
                <form onSubmit={submitHandler}>
                    <div className="input-group input-group-sm">
                        <div className="input-group-text">SO#</div>
                        <input type="search" value={so} className="form-control"
                               maxLength={7} minLength={6}
                               onChange={(ev) => setSO(ev.target.value)}/>
                        <SpinnerButton type="submit" color="primary" spinning={loading} size="sm">Load</SpinnerButton>
                    </div>
                </form>
            </div>
            <div className="col-auto">
                <div className="input-group input-group-sm">
                    <div className="input-group-text">Extra</div>
                    <input type="number" value={extra} className="form-control" min={0} max={100}
                           onChange={(ev) => dispatch(setExtraStickers(ev.target.valueAsNumber))}/>
                    <div className="input-group-text">%</div>
                </div>
            </div>
            <div className="col-auto">

            </div>
            <div className="col-auto">
                Sort: <strong>{sort.field}</strong>
            </div>
            <div className="col-auto">
                <FormCheck type={"checkbox"} label={"Print Reversed"}
                           checked={reversed}
                           onChange={(ev) => setReversed(ev.target.checked)}/>
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
