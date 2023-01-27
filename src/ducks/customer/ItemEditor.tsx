import React, {ChangeEvent, FormEvent, useEffect, useState} from 'react'
import {useAppDispatch} from "../../app/configureStore";
import {useSelector} from "react-redux";
import {selectCurrentCustomer, selectCustomerItem, selectCustomerLoading, selectItemAction} from "./selectors";
import {BarcodeItem} from "chums-types";
import {newItem} from "./utils";
import {Alert, FormColumn, SpinnerButton} from "chums-components";
import {SageItem} from "../../types";
import ItemAutocomplete from "../../components/ItemAutocomplete";
import {selectCanEdit} from "../user";
import classNames from "classnames";
import numeral from "numeral";
import {removeCustomerItem, saveCustomerItem} from "./actions";
import ExistingItemAlert from "./ExistingItemAlert";
import ItemInput from "./ItemInput";
import RemoveItemDialog from "./RemoveItemDialog";
import {TextareaAutosize} from "@mui/material";

export interface EditableItem extends BarcodeItem {
    changed?: boolean;
}

const ItemEditor = () => {
    const dispatch = useAppDispatch();
    const currentItem = useSelector(selectCustomerItem);
    const settings = useSelector(selectCurrentCustomer);
    const loading = useSelector(selectCustomerLoading);
    const itemAction = useSelector(selectItemAction);

    const canEdit = useSelector(selectCanEdit);

    const [barcodeItem, setBarcodeItem] = useState<EditableItem>({...newItem, CustomerID: settings?.id});
    const [sageItem, setSageItem] = useState<SageItem | null>(null);
    const [locked, setLocked] = useState(false);
    const [confirmDelete, setConfirmDelete] = useState(false);

    useEffect(() => {
        if (currentItem) {
            setLocked(true);
            return setBarcodeItem({...currentItem});
        }
        setBarcodeItem({...newItem, CustomerID: settings?.id});
    }, [currentItem]);


    const selectItemHandler = (item?: SageItem) => {
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

    const lockHandler = () => setLocked(!locked);

    const setSageValue = (field: keyof BarcodeItem, sageField: keyof SageItem) => () => {
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
            <form>
                <FormColumn label="Item">
                    <ItemAutocomplete value={barcodeItem.ItemCode ?? ''}
                                      itemCode={barcodeItem.ItemCode} onChange={changeHandler('ItemCode')}
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
                </FormColumn>
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
                <ItemInput field="UPC" label="UPC" value={barcodeItem.UPC} onChange={changeHandler('UPC')}>
                    <button type="button"
                            className={classNames("btn btn-sm btn-outline-secondary", {
                                'btn-secondary': barcodeItem.UPC === sageItem?.UDF_UPC,
                                'btn-outline-secondary': barcodeItem.UPC !== sageItem?.UDF_UPC,
                            })}
                            title={sageItem?.UDF_UPC ?? undefined}
                            disabled={!sageItem || !canEdit} onClick={setSageValue('UPC', 'UDF_UPC')}>
                                <span
                                    className={classNames("bi-chevron-left", {'text-light': barcodeItem.UPC === sageItem?.UDF_UPC})}/>
                    </button>
                    <button type="button"
                            className={classNames("btn btn-sm", {
                                'btn-info': barcodeItem.UPC === sageItem?.UDF_UPC_BY_COLOR,
                                'btn-outline-info': barcodeItem.UPC !== sageItem?.UDF_UPC_BY_COLOR,
                            })}
                            title={sageItem?.UDF_UPC_BY_COLOR ?? undefined}
                            disabled={!sageItem || !canEdit} onClick={setSageValue('UPC', 'UDF_UPC_BY_COLOR')}>
                        <span className="bi-chevron-left"/>
                    </button>
                </ItemInput>
                <ItemInput field="Custom1" label={settings.custom1Name} value={barcodeItem.Custom1}
                           onChange={changeHandler('Custom1')}/>
                <ItemInput field="Custom2" label={settings.custom2Name} value={barcodeItem.Custom2}
                           onChange={changeHandler('Custom2')}/>
                <ItemInput field="Custom3" label={settings.custom3Name} value={barcodeItem.Custom3}
                           onChange={changeHandler('Custom3')}/>
                <ItemInput field="Custom4" label={settings.custom4Name} value={barcodeItem.Custom4}
                           onChange={changeHandler('Custom4')}/>
                <FormColumn label="Notes" className="mb-1">
                    <TextareaAutosize minRows={2} value={barcodeItem.Notes ?? ''}
                                      readOnly={!canEdit}
                                      className="form-control form-control-sm"
                                      onChange={changeHandler('Notes')}/>
                </FormColumn>
                <FormColumn label="Special Instructions" className="mb-1">
                    <TextareaAutosize minRows={2} value={barcodeItem.SpecialInstructions ?? ''}
                                      readOnly={!canEdit}
                                      className="form-control form-control-sm"
                                      onChange={changeHandler('SpecialInstructions')}/>
                </FormColumn>
                <div className="mt-3 row g-3">
                    <div className="col-auto">
                        <SpinnerButton type="submit" color="primary"
                                       spinning={itemAction === 'loading' || itemAction === 'saving'}

                                       onClick={saveHandler}
                                       disabled={!canEdit || !barcodeItem.ItemCode || itemAction !== 'idle'}>
                            Save Item
                        </SpinnerButton>
                    </div>
                    <div className="col-auto">
                        <button type="button" className="btn btn-outline-secondary"
                                onClick={newItemHandler} disabled={!canEdit || itemAction !== 'idle'}>
                            New Item
                        </button>
                    </div>
                    <div className="col-auto">
                        <button type="button" className="btn btn-outline-danger"
                                onClick={() => {
                                    setConfirmDelete(true)
                                }}
                                disabled={!canEdit || itemAction !== 'idle'}>
                            Delete Item
                        </button>
                        <RemoveItemDialog item={currentItem} open={confirmDelete} onConfirm={deleteHandler}
                                          onCancel={() => setConfirmDelete(false)}/>
                    </div>
                </div>
            </form>
            {barcodeItem.changed && (
                <Alert color="warning">
                    <span className="bi-exclamation-triangle-fill me-1"/>
                    Don't forget to save!
                </Alert>
            )}
        </div>
    )
}

export default ItemEditor;
