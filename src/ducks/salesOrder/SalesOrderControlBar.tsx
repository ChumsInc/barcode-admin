import {type ChangeEvent, type FormEvent, startTransition, useEffect, useId, useState} from 'react';
import {useAppDispatch, useAppSelector} from "@/app/configureStore";
import {useSelector} from "react-redux";
import {
    selectDetailSort,
    selectExtraQuantity,
    selectSalesOrderLoading,
    selectSalesOrderNo,
    selectShipTo,
    selectShipToList,
    selectStickerQty
} from "./selectors";
import {generateStickers, loadSalesOrder, setExtraStickers, setShipTo} from "./actions";
import {useSearchParams} from "react-router";
import StickerQuantityGeneratedAlert from "./StickerQuantityGeneratedAlert";
import FormCheck from "react-bootstrap/FormCheck";
import {SpinnerButton} from "@chumsinc/react-bootstrap-addons";

const SalesOrderControlBar = () => {
    const dispatch = useAppDispatch();
    const [searchParams, setSearchParams] = useSearchParams();
    const salesOrderNo = useAppSelector(selectSalesOrderNo);
    const loading = useAppSelector(selectSalesOrderLoading);
    const extra = useAppSelector(selectExtraQuantity);
    const sort = useAppSelector(selectDetailSort);
    const count = useAppSelector(selectStickerQty);
    const [so, setSO] = useState(salesOrderNo);
    const [reversed, setReversed] = useState<boolean>(false);
    const [version, setVersion] = useState<number>(1);
    const shipTo = useSelector(selectShipTo);
    const shipToList = useSelector(selectShipToList);
    const listId = useId();
    const stickerVersionId = useId();
    const idPrintReversed = useId();


    useEffect(() => {
        const so = searchParams.get('salesOrderNo');
        if (!!so && so !== salesOrderNo) {
            dispatch(loadSalesOrder(so.padStart(7, '0')));
        }
    }, [dispatch, salesOrderNo, searchParams]);

    useEffect(() => {
        startTransition(() => {
            setSO(salesOrderNo);
            setSearchParams({salesOrderNo});
            setVersion(1);
        })
    }, [salesOrderNo, setSearchParams]);

    const handleChangeShipTo = (ev: ChangeEvent<HTMLInputElement>) => {
        dispatch(setShipTo(ev.target.value));
    }

    const versionClickHandler = (ev: ChangeEvent<HTMLInputElement>) => {
        setVersion(ev.target.checked ? 2 : 1);
    }

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
                        <SpinnerButton type="submit" variant="primary" spinning={loading} size="sm">Load</SpinnerButton>
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
                <div className="input-group input-group-sm">
                    <div className="input-group-text">Store</div>
                    <input type="search" className="form-control form-control-sm"
                           value={shipTo} onChange={handleChangeShipTo} list={listId}/>
                    <datalist id={listId}>
                        {shipToList.map(value => (<option key={value}>{value}</option>))}'
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
                           checked={version === 2}
                           onChange={versionClickHandler}/>
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
