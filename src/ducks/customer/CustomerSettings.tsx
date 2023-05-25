import React, {ChangeEvent, FormEvent, useEffect, useId, useState} from 'react';
import {useAppDispatch} from "../../app/configureStore";
import {BarcodeCustomerSettings, Editable} from "chums-types";
import {newCustomer} from "../customers/utils";
import {useSelector} from "react-redux";
import {selectCurrentCustomer, selectCustomerItemsCount} from "./selectors";
import {customerKey} from "../../utils/customer";
import CustomerAutocomplete from "../../components/CustomerAutocomplete";
import {BarcodeCustomerList, SearchCustomer} from "../../types";
import {TextareaAutosize} from "@mui/material";
import {Alert, FormCheck, noop} from "chums-components";
import CustomOptionSetting from "../../components/CustomOptionSetting";
import {saveCustomer} from "./actions";
import {selectCustomerList, selectCustomersLoaded, selectCustomersLoading} from "../customers/selectors";
import {loadCustomers} from "../customers/actions";
import InactiveCustomerAlert from "./InactiveCustomerAlert";
import {selectCanEdit} from "../user";
import ReloadCustomerButton from "./ReloadCustomerButton";
import StickerToggleButton from "./StickerToggleButton";


const CustomerSettings = () => {
    function isDuplicate(customer: BarcodeCustomerSettings, customerList: BarcodeCustomerList): boolean {
        return !!customerList[customerKey(customer)] && customerList[customerKey(customer)].id !== customer.id;
    }

    const dispatch = useAppDispatch();
    const [customer, setCustomer] = useState<BarcodeCustomerSettings & Editable>({...newCustomer});
    const canEdit = useSelector(selectCanEdit);
    const itemsCount = useSelector(selectCustomerItemsCount);
    const [customerSearch, setCustomerSearch] = useState(customerKey(customer));
    const current = useSelector(selectCurrentCustomer);
    const customerList = useSelector(selectCustomerList);
    const loaded = useSelector(selectCustomersLoaded);
    const loading = useSelector(selectCustomersLoading);
    const [duplicate, setDuplicate] = useState(isDuplicate(customer, customerList));
    const activeId = useId();

    useEffect(() => {
        if (!loaded && !loading) {
            dispatch(loadCustomers());
        }
    }, []);

    useEffect(() => {
        setCustomer(current ?? {...newCustomer});
    }, [current]);

    useEffect(() => {
        setDuplicate(isDuplicate(customer, customerList));
        setCustomerSearch(customerKey(customer));
    }, [customer, customerList])


    const onChangeCustomer = (field: keyof BarcodeCustomerSettings) => (ev: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        if (!canEdit) {
            return;
        }
        setCustomer({...customer, [field]: ev.target.value, changed: true});
    }

    const toggleCustomer = (field: keyof BarcodeCustomerSettings) => () => {
        if (!canEdit) {
            return;
        }

        setCustomer({...customer, [field]: !customer[field], changed: true});
    }
    const onSelectHandler = (searchCustomer?: SearchCustomer) => {
        if (!canEdit) {
            return;
        }
        if (searchCustomer && customerKey(searchCustomer) !== customerKey(customer)) {
            setCustomer({...customer, ...searchCustomer, changed: true});
        }
    }

    const resetHandler = () => {
        if (current) {
            setCustomer({...current})
        } else {
            setCustomer({...newCustomer});
        }
    }

    const saveHandler = (ev: FormEvent) => {
        ev.preventDefault();
        if (!canEdit) {
            return;
        }
        if (!customerKey(customer)) {
            return;
        }
        dispatch(saveCustomer(customer));
    }

    return (

        <div className="container">
            <form onSubmit={saveHandler}>
                {!!customer.CustomerNo && <h2>{customer.CustomerName} ({customerKey(customer)})</h2>}
                {!customer.CustomerNo && <h2>New Customer</h2>}
                <div className="row g-3 align-items-baseline mt-3">
                    <div className="col-auto">ID</div>
                    <div className="col-auto text-secondary">{customer.id || 'NEW'}</div>
                    <div className="col-auto">Account No</div>
                    <div className="col-auto">
                        <CustomerAutocomplete customer={customer} onSelectCustomer={onSelectHandler}/>
                    </div>
                    <div className="col-auto">
                        <div className="form-check form-check-inline">
                            <input type="checkbox" className="form-check-input" id={activeId}
                                   checked={customer.active} onChange={toggleCustomer('active')}/>
                            <label className="form-check-label" htmlFor={activeId}>Active Customer</label>
                        </div>

                    </div>
                    <div className="col-auto">
                        <button type="submit" className="btn btn-sm btn-primary"
                                disabled={duplicate}>
                            Save
                        </button>
                    </div>
                    <div className="col-auto">
                        <ReloadCustomerButton/>
                    </div>
                    {!duplicate && customer.changed && (
                        <div className="col">
                            <Alert color="warning"><strong className="me-3">Changed!</strong>Don't forget to
                                save.</Alert>
                        </div>
                    )}
                </div>
                <InactiveCustomerAlert/>
                {duplicate && (
                    <Alert color="danger">
                        <strong className="me-3">Heads Up!</strong>
                        {customerList[customerKey(customer)].CustomerName} ({customerKey(customerList[customerKey(customer)])})
                        already exists in Barcode Admin.
                    </Alert>
                )}
                <div className="row g-3 mt-1">
                    <div className="col-lg-6">
                        <label className="form-label">
                            <button className="btn btn-sm btn-info"><span className="bi-card-text"/> Notes</button>
                        </label>
                        <TextareaAutosize minRows={2} value={customer.Notes ?? ''}
                                          readOnly={!canEdit}
                                          className="form-control form-control-sm"
                                          onChange={onChangeCustomer('Notes')}/>
                        <small className="text-muted">Best used for notes for maintaining this customer.</small>
                    </div>
                    <div className="col-lg-6">
                        <label className="form-label">
                            <button className="btn btn-sm btn-warning">
                                <span className="bi-card-text"/> Special Instructions
                            </button>
                        </label>
                        <TextareaAutosize minRows={2} value={customer.SpecialInstructions ?? ''}
                                          readOnly={!canEdit}
                                          className="form-control form-control-sm"
                                          onChange={onChangeCustomer('SpecialInstructions')}/>
                        <small className="text-muted">Best used for instructions when printing stickers, etc.</small>
                    </div>
                </div>
                <div className="mt-3">
                    <h4>Customer Fields</h4>
                </div>
                <div className="row g-3">
                    <div className="col-lg-4">
                        <div className="my-1">
                            <FormCheck type="checkbox" label="Item Code" checked={true} onChange={noop} readOnly/>
                        </div>
                        <div className="my-1">
                            <FormCheck type="checkbox" label="Alt Item No" checked={customer.reqAltItemNumber}
                                       onChange={toggleCustomer('reqAltItemNumber')} readOnly={!canEdit}/>
                        </div>
                        <div className="my-1">
                            <FormCheck type="checkbox" label="Description" checked={customer.reqItemDescription}
                                       onChange={toggleCustomer('reqItemDescription')} readOnly={!canEdit}/>
                        </div>
                        <div className="my-1">
                            <FormCheck type="checkbox" label="Color" checked={customer.reqColor}
                                       onChange={toggleCustomer('reqColor')} readOnly={!canEdit}/>
                        </div>
                        <div className="my-1">
                        </div>
                    </div>
                    <div className="col-lg-4">
                        <div className="my-1">
                            <FormCheck type="checkbox" label="SKU" checked={customer.reqSKU}
                                       onChange={toggleCustomer('reqSKU')} readOnly={!canEdit}/>
                        </div>
                        <div className="my-1">
                            <FormCheck type="checkbox" label="Customer Part No" checked={customer.reqCustomerPart}
                                       onChange={toggleCustomer('reqCustomerPart')} readOnly={!canEdit}/>
                        </div>
                        <div className="my-1">
                            <FormCheck type="checkbox" label="UPC" checked={customer.reqUPC}
                                       onChange={toggleCustomer('reqUPC')} readOnly={!canEdit}/>
                        </div>
                        <div className="my-1">
                            <FormCheck type="checkbox" label="MSRP" checked={customer.reqMSRP}
                                       onChange={toggleCustomer('reqMSRP')} readOnly={!canEdit}/>
                        </div>
                    </div>
                    <div className="col-lg-4">
                        <div className="my-1">
                            <CustomOptionSetting name="Custom 1"
                                                 required={customer.reqCustom1}
                                                 onChangeRequired={toggleCustomer('reqCustom1')}
                                                 value={customer.custom1Name}
                                                 onChangeValue={onChangeCustomer('custom1Name')}/>
                        </div>
                        <div className="my-1">
                            <CustomOptionSetting name="Custom 2"
                                                 required={customer.reqCustom2}
                                                 onChangeRequired={toggleCustomer('reqCustom2')}
                                                 value={customer.custom2Name}
                                                 onChangeValue={onChangeCustomer('custom2Name')}/>
                        </div>
                        <div className="my-1">
                            <CustomOptionSetting name="Custom 3"
                                                 required={customer.reqCustom3}
                                                 onChangeRequired={toggleCustomer('reqCustom3')}
                                                 value={customer.custom3Name}
                                                 onChangeValue={onChangeCustomer('custom3Name')}/>

                        </div>
                        <div className="my-1">
                            <CustomOptionSetting name="Custom 4"
                                                 required={customer.reqCustom4}
                                                 onChangeRequired={toggleCustomer('reqCustom4')}
                                                 value={customer.custom4Name}
                                                 onChangeValue={onChangeCustomer('custom4Name')}/>
                        </div>
                    </div>
                </div>
                <div className="mt-3">
                    <hr/>
                    <h4>Customer Sticker Settings</h4>
                    <div>
                        <div className="btn-group btn-group-sm me-5">
                            <StickerToggleButton checked={customer.itemStickerAll ?? false} onChange={toggleCustomer('itemStickerAll')} icon="bi-1-square" disabled={!canEdit} />
                            <StickerToggleButton checked={customer.bagStickerAll ?? false} onChange={toggleCustomer('bagStickerAll')} icon="bi-bag" disabled={!canEdit} />
                            <StickerToggleButton checked={customer.caseStickerAll ?? false} onChange={toggleCustomer('caseStickerAll')} icon="bi-box" disabled={!canEdit} />
                        </div>
                        <small>Require stickers for all items if checked</small>
                    </div>
                </div>
            </form>
            <div>
                <hr />
                <Alert color="info">
                    <strong>Configured items</strong>: {itemsCount}
                </Alert>
            </div>
        </div>
    )

}
export default CustomerSettings;
