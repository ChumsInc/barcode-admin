import {type ChangeEvent, type FormEvent, useEffect, useState} from 'react'
import {useAppDispatch} from "@/app/configureStore";
import {useSelector} from "react-redux";
import {selectCurrentCustomer, selectCustomerItem, selectItemAction} from "./selectors";
import type {BarcodeItem, Editable, SearchItem} from "chums-types";
import {newItem} from "./utils";
import ItemAutocomplete from "../../components/ItemAutocomplete";
import {selectCanEdit} from "../user";
import classNames from "classnames";
import numeral from "numeral";
import {removeCustomerItem, saveCustomerItem} from "./actions";
import ExistingItemAlert from "./ExistingItemAlert";
import ItemInput from "./ItemInput";
import RemoveItemDialog from "./RemoveItemDialog";
import TextareaAutosize from "@mui/material/TextareaAutosize";
import AssignNextUPCButton from "./AssignNextUPCButton";
import StickerToggleButton from "./StickerToggleButton";
import Tooltip from "@mui/material/Tooltip";
import {formatGTIN} from "@chumsinc/gtin-tools";
import {Col, Form, Row} from "react-bootstrap";
import {SpinnerButton} from "@chumsinc/react-bootstrap-addons";
import Alert from "react-bootstrap/Alert";
import Button from "react-bootstrap/Button";

export interface EditableItem extends BarcodeItem {
    changed?: boolean;
}

const ItemEditor = () => {
    const dispatch = useAppDispatch();
    const currentItem = useSelector(selectCustomerItem);
    const settings = useSelector(selectCurrentCustomer);
    const itemAction = useSelector(selectItemAction);

    const canEdit = useSelector(selectCanEdit);


    const [barcodeItem, setBarcodeItem] = useState<BarcodeItem & Editable>({...newItem, CustomerID: settings?.id});
    const [sageItem, setSageItem] = useState<SearchItem | null>(null);
    const [locked, setLocked] = useState(false);
    const [confirmDelete, setConfirmDelete] = useState(false);

    useEffect(() => {
        if (currentItem) {
            setLocked(true);
            return setBarcodeItem({...currentItem});
        }
        setBarcodeItem({...newItem, CustomerID: settings?.id});
    }, [currentItem]);


    const selectItemHandler = (item?: SearchItem | null) => {
        setSageItem(item ?? null);
        if (item) {
            console.log('selectItemHandler', item);
            setBarcodeItem({
                ...barcodeItem,
                ItemCode: item.ItemCode,
                changed: barcodeItem.changed || barcodeItem.ItemCode !== item.ItemCode
            });
        }
    }

    const changeHandler = (field: keyof BarcodeItem) => (ev: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setBarcodeItem({...barcodeItem, [field]: ev.target.value, changed: true});
    }

    const toggleHandler = (field: keyof Pick<BarcodeItem, 'itemSticker' | 'bagSticker' | 'caseSticker'>) => (ev: ChangeEvent<HTMLInputElement>) => {
        setBarcodeItem({...barcodeItem, [field]: ev.target.checked, changed: true});
    }

    const lockHandler = () => setLocked(!locked);

    const setSageValue = (field: keyof BarcodeItem, sageField: keyof SearchItem) => () => {
        if (!sageItem || !canEdit) {
            return;
        }
        setBarcodeItem({...barcodeItem, [field]: sageItem[sageField], changed: true});
    }

    const saveHandler = (ev: FormEvent) => {
        ev.preventDefault();
        if (!barcodeItem || !canEdit) {
            return;
        }
        dispatch(saveCustomerItem(barcodeItem));
    }

    const deleteHandler = () => {
        if (!currentItem) {
            return;
        }
        dispatch(removeCustomerItem(currentItem));
        setConfirmDelete(false);
    }

    const newItemHandler = () => {
        if (!canEdit) {
            return;
        }
        if (barcodeItem.changed) {
            if (!window.confirm(`Are you sure you want to lose your changes to ${barcodeItem.ItemCode} (id=${barcodeItem.ID}?`)) {
                return;
            }
        }
        setBarcodeItem({...newItem, CustomerID: settings?.id});
        setLocked(false)
    }

    if (!settings) {
        return (
            <h3>Select A Customer</h3>
        )
    }
    return (
        <div>
            <h3>Item Settings</h3>
            <Form onSubmit={saveHandler}>
                <Form.Group as={Row} label="Item">
                    <Form.Label column sm={4}>Item</Form.Label>
                    <Col sm={8}>
                        <ItemAutocomplete itemCode={barcodeItem.ItemCode ?? ''}
                                          onChange={changeHandler('ItemCode')}
                                          readOnly={locked || !canEdit}
                                          required
                                          onSelectItem={selectItemHandler}>
                            <button type="button" className="btn btn-outline-secondary"
                                    disabled={!canEdit}
                                    onClick={lockHandler}>
                                <span className={locked ? 'bi-lock-fill' : 'bi-pencil-fill'}/>
                            </button>
                        </ItemAutocomplete>
                        {(barcodeItem?.ID || sageItem) &&
                            <small className="text-muted">{sageItem?.ItemCodeDesc ?? 'Invalid Sage Item'}</small>}
                        <ExistingItemAlert item={barcodeItem}/>
                    </Col>
                </Form.Group>
                <ItemInput field={"ItemDescription"} value={barcodeItem.ItemDescription} label={"Description"}
                           onChange={changeHandler('ItemDescription')}>
                    <button type="button" className="btn btn-sm btn-outline-secondary"
                            disabled={!sageItem || !canEdit} onClick={setSageValue('ItemDescription', 'ItemCodeDesc')}>
                        <span className="bi-chevron-left"/>
                    </button>
                </ItemInput>
                <ItemInput field={"AltItemCode"} value={barcodeItem.AltItemCode} label={"Alternate Item Code"}
                           onChange={changeHandler('AltItemCode')}>
                    <button type="button" className="btn btn-sm btn-outline-secondary"
                            title={sageItem?.Category1 ?? undefined}
                            disabled={!sageItem || !canEdit} onClick={setSageValue('AltItemCode', 'Category1')}>
                        <span className="bi-chevron-left"/>
                    </button>
                </ItemInput>
                <ItemInput field="Color" label="Color" value={barcodeItem.Color} onChange={changeHandler('Color')}/>
                <ItemInput field="SKU" label="SKU" value={barcodeItem.SKU} onChange={changeHandler('SKU')}/>
                <ItemInput field="CustomerPart" label="Customer Part" value={barcodeItem.CustomerPart}
                           onChange={changeHandler('CustomerPart')}/>
                <ItemInput field="MSRP" label="MSRP" value={barcodeItem.MSRP} onChange={changeHandler('MSRP')}>
                    {!!sageItem?.SuggestedRetailPrice && Number(barcodeItem.MSRP ?? 0) !== Number(sageItem?.SuggestedRetailPrice) && (
                        <div className="input-group-text text-danger">
                            <span className="bi-exclamation-triangle-fill me-1"/>
                            {sageItem?.SuggestedRetailPrice}
                        </div>
                    )}
                    <button type="button" className="btn btn-sm btn-outline-secondary"
                            title={numeral(sageItem?.SuggestedRetailPrice ?? null).format('0.00')}
                            disabled={!sageItem || !canEdit}
                            onClick={setSageValue('MSRP', 'SuggestedRetailPrice')}>
                        <span className="bi-chevron-left"/>
                    </button>
                </ItemInput>
                <ItemInput field="UPC" label="UPC" value={barcodeItem.UPC} onChange={changeHandler('UPC')}
                           helpText="Automatically calculates check digits for numeric codes length 11-14, 16-18">
                    <Tooltip title={formatGTIN(sageItem?.UDF_UPC ?? '')}>
                        <button type="button"
                                className={classNames("btn btn-sm btn-outline-secondary", {
                                    'btn-secondary': barcodeItem.UPC === sageItem?.UDF_UPC,
                                    'btn-outline-secondary': barcodeItem.UPC !== sageItem?.UDF_UPC,
                                })}
                                disabled={!sageItem || !canEdit} onClick={setSageValue('UPC', 'UDF_UPC')}>
                                    <span
                                        className={classNames("bi-chevron-left", {'text-light': barcodeItem.UPC === sageItem?.UDF_UPC})}/>
                        </button>
                    </Tooltip>
                    <Tooltip title={formatGTIN(sageItem?.UDF_UPC_BY_COLOR ?? '')}>
                        <button type="button"
                                className={classNames("btn btn-sm", {
                                    'btn-info': barcodeItem.UPC === sageItem?.UDF_UPC_BY_COLOR,
                                    'btn-outline-info': barcodeItem.UPC !== sageItem?.UDF_UPC_BY_COLOR,
                                })}
                                disabled={!sageItem || !canEdit} onClick={setSageValue('UPC', 'UDF_UPC_BY_COLOR')}>
                            <span className="bi-chevron-left"/>
                        </button>
                    </Tooltip>
                    <AssignNextUPCButton sageItem={sageItem}/>
                </ItemInput>
                <Form.Group as={Row} label="Stickers">
                    <Form.Label column sm={4}>Stickers</Form.Label>
                    <Col sm={8}>
                        <div className="btn-group btn-group-sm" role="group" aria-label="Toggle Required Stickers">
                            <StickerToggleButton checked={barcodeItem.itemSticker || settings.itemStickerAll || false}
                                                 onChange={toggleHandler('itemSticker')} icon="bi-1-square"
                                                 disabled={settings.itemStickerAll}/>
                            <StickerToggleButton checked={barcodeItem.bagSticker || settings.bagStickerAll || false}
                                                 onChange={toggleHandler('bagSticker')} icon="bi-bag"
                                                 disabled={settings.bagStickerAll}/>
                            <StickerToggleButton checked={barcodeItem.caseSticker || settings.caseStickerAll || false}
                                                 onChange={toggleHandler('caseSticker')} icon="bi-box"
                                                 disabled={settings.caseStickerAll}/>
                        </div>
                    </Col>
                </Form.Group>
                <ItemInput field="Custom1" label={settings.custom1Name} value={barcodeItem.Custom1}
                           onChange={changeHandler('Custom1')}/>
                <ItemInput field="Custom2" label={settings.custom2Name} value={barcodeItem.Custom2}
                           onChange={changeHandler('Custom2')}/>
                <ItemInput field="Custom3" label={settings.custom3Name} value={barcodeItem.Custom3}
                           onChange={changeHandler('Custom3')}/>
                <ItemInput field="Custom4" label={settings.custom4Name} value={barcodeItem.Custom4}
                           onChange={changeHandler('Custom4')}/>
                <Form.Group as={Row} className="mb-1">
                    <Form.Label column sm={4}>Notes</Form.Label>
                    <Col>
                        <TextareaAutosize minRows={2} value={barcodeItem.Notes ?? ''}
                                          readOnly={!canEdit}
                                          className="form-control form-control-sm"
                                          onChange={changeHandler('Notes')}/>
                    </Col>
                </Form.Group>
                <Form.Group as={Row} className="mb-1">
                    <Form.Label column sm={4}>Special Instructions</Form.Label>
                    <Col>
                        <TextareaAutosize minRows={2} value={barcodeItem.SpecialInstructions ?? ''}
                                          readOnly={!canEdit}
                                          className="form-control form-control-sm"
                                          onChange={changeHandler('SpecialInstructions')}/>
                    </Col>
                </Form.Group>
                <Row className="mt-3 g-3 justify-content-end">
                    <Col xs="auto">
                        <Button type="button" variant="outline-danger" size="sm"
                                onClick={() => {
                                    setConfirmDelete(true)
                                }}
                                disabled={!canEdit || itemAction !== 'idle'}>
                            Delete Item
                        </Button>
                        <RemoveItemDialog item={currentItem} open={confirmDelete} onConfirm={deleteHandler}
                                          onCancel={() => setConfirmDelete(false)}/>
                    </Col>
                    <Col xs="auto">
                        <Button type="button" variant="outline-secondary" size="sm"
                                onClick={newItemHandler} disabled={!canEdit || itemAction !== 'idle'}>
                            New Item
                        </Button>
                    </Col>
                    <Col xs="auto">
                        <SpinnerButton type="submit" color="primary" size="sm"
                                       spinning={itemAction === 'loading' || itemAction === 'saving'}
                                       disabled={!canEdit || !barcodeItem.ItemCode || itemAction !== 'idle'}>
                            Save Item
                        </SpinnerButton>
                    </Col>
                </Row>
            </Form>
            {barcodeItem.changed && (
                <Alert variant="warning">
                    <span className="bi-exclamation-triangle-fill me-1"/>
                    Don't forget to save!
                </Alert>
            )}
        </div>
    )
}

export default ItemEditor;
