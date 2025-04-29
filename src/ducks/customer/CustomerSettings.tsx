import React, {ChangeEvent, FormEvent, useEffect, useId, useState} from 'react';
import {useAppDispatch} from "../../app/configureStore";
import {BarcodeCustomerSettings, Editable} from "chums-types";
import {newCustomer} from "../customers/utils";
import {useSelector} from "react-redux";
import {
    selectCurrentCustomer,
    selectCustomerItemsCount,
    selectCustomerLoading,
    selectCustomerSaving
} from "./selectors";
import {customerKey} from "../../utils/customer";
import CustomerAutocomplete from "../../components/CustomerAutocomplete";
import {BarcodeCustomerList, SearchCustomer} from "../../types";
import TextareaAutosize from "@mui/material/TextareaAutosize";
import TextField from "@mui/material/TextField";
import CustomOptionSetting from "../../components/CustomOptionSetting";
import {saveCustomer} from "./actions";
import {selectCustomerList, selectCustomersLoaded} from "../customers/selectors";
import {loadCustomers} from "../customers/actions";
import InactiveCustomerAlert from "./InactiveCustomerAlert";
import {selectCanEdit} from "../user";
import ReloadCustomerButton from "./ReloadCustomerButton";
import StickerToggleButton from "./StickerToggleButton";
import Button from "@mui/material/Button";
import CustomerProgressBar from "./CustomerProgressBar";
import Alert from "react-bootstrap/Alert";
import FormCheck from "react-bootstrap/FormCheck";


function isDuplicate(customer: BarcodeCustomerSettings, customerList: BarcodeCustomerList): boolean {
    return !!customerList[customerKey(customer)] && customerList[customerKey(customer)].id !== customer.id;
}

const CustomerSettings = () => {

    const dispatch = useAppDispatch();
    const [customer, setCustomer] = useState<BarcodeCustomerSettings & Editable>({...newCustomer});
    const canEdit = useSelector(selectCanEdit);
    const itemsCount = useSelector(selectCustomerItemsCount);
    const [customerSearch, setCustomerSearch] = useState(customerKey(customer));
    const current = useSelector(selectCurrentCustomer);
    const customerList = useSelector(selectCustomerList);
    const loaded = useSelector(selectCustomersLoaded);
    const loading = useSelector(selectCustomerLoading);
    const saving = useSelector(selectCustomerSaving);
    const [customerExists, setCustomerExists] = useState(isDuplicate(customer, customerList));
    const activeId = useId();
    const idReqAltItemCode = useId();
    const idReqDescription = useId();
    const idReqColor = useId();
    const idReqSKU = useId();
    const idReqCustomerPart = useId();
    const idReqUPC = useId();
    const idReqMSRP = useId();

    useEffect(() => {
        if (!loaded && !loading) {
            dispatch(loadCustomers());
        }
    }, []);

    useEffect(() => {
        setCustomer(current ?? {...newCustomer});
    }, [current]);

    useEffect(() => {
        setCustomerExists(isDuplicate(customer, customerList));
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
    const onSelectHandler = (searchCustomer?: SearchCustomer | null) => {
        console.debug('onSelectHandler()', searchCustomer);
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
                <div className="row g-3 align-items-center mt-3 mb-1">
                    <div className="col-auto">
                        <TextField size="small" variant="filled" slotProps={{htmlInput: {readOnly: true}}} label="ID"
                                   value={customer.id ?? 'NEW'}/>
                    </div>
                    <div className="col-auto">
                        <CustomerAutocomplete customer={customer} onSelectCustomer={onSelectHandler} required/>
                    </div>
                    <div className="col-auto">
                        <FormCheck type="checkbox" label="Active Customer" id={activeId}
                                   checked={customer.active} onChange={toggleCustomer('active')}
                        />
                    </div>
                    <div className="col-auto">
                        <Button type="submit" variant="outlined" size="small" disabled={customerExists}>
                            Save
                        </Button>
                    </div>
                    <div className="col-auto">
                        <ReloadCustomerButton/>
                    </div>
                    {!customerExists && customer.changed && (
                        <div className="col">
                            <Alert variant="warning"><strong className="me-3">Changed!</strong>Don't forget to
                                save.</Alert>
                        </div>
                    )}
                </div>
                <CustomerProgressBar/>
                <InactiveCustomerAlert/>
                {customerExists && (
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
                            <FormCheck type="checkbox" label="Item Code" checked={true} readOnly/>
                        </div>
                        <div className="my-1">
                            <FormCheck type="checkbox" label="Alt Item No" id={idReqAltItemCode}
                                       checked={customer.reqAltItemNumber}
                                       onChange={toggleCustomer('reqAltItemNumber')} readOnly={!canEdit}/>
                        </div>
                        <div className="my-1">
                            <FormCheck type="checkbox" label="Description" id={idReqDescription}
                                       checked={customer.reqItemDescription}
                                       onChange={toggleCustomer('reqItemDescription')} readOnly={!canEdit}/>
                        </div>
                        <div className="my-1">
                            <FormCheck type="checkbox" label="Color" id={idReqColor}
                                       checked={customer.reqColor}
                                       onChange={toggleCustomer('reqColor')} readOnly={!canEdit}/>
                        </div>
                        <div className="my-1">
                        </div>
                    </div>
                    <div className="col-lg-4">
                        <div className="my-1">
                            <FormCheck type="checkbox" label="SKU" id={idReqSKU}
                                       checked={customer.reqSKU}
                                       onChange={toggleCustomer('reqSKU')} readOnly={!canEdit}/>
                        </div>
                        <div className="my-1">
                            <FormCheck type="checkbox" label="Customer Part No" id={idReqCustomerPart}
                                       checked={customer.reqCustomerPart}
                                       onChange={toggleCustomer('reqCustomerPart')} readOnly={!canEdit}/>
                        </div>
                        <div className="my-1">
                            <FormCheck type="checkbox" label="UPC" id={idReqUPC}
                                       checked={customer.reqUPC}
                                       onChange={toggleCustomer('reqUPC')} readOnly={!canEdit}/>
                        </div>
                        <div className="my-1">
                            <FormCheck type="checkbox" label="MSRP" id={idReqMSRP}
                                       checked={customer.reqMSRP}
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
                            <StickerToggleButton checked={customer.itemStickerAll ?? false}
                                                 onChange={toggleCustomer('itemStickerAll')} icon="bi-1-square"
                                                 disabled={!canEdit}/>
                            <StickerToggleButton checked={customer.bagStickerAll ?? false}
                                                 onChange={toggleCustomer('bagStickerAll')} icon="bi-bag"
                                                 disabled={!canEdit}/>
                            <StickerToggleButton checked={customer.caseStickerAll ?? false}
                                                 onChange={toggleCustomer('caseStickerAll')} icon="bi-box"
                                                 disabled={!canEdit}/>
                        </div>
                        <small>Require stickers for all items if checked</small>
                    </div>
                </div>
            </form>
            <div>
                <hr/>
                <Alert color="info">
                    <strong>Configured items</strong>: {itemsCount}
                </Alert>
            </div>
        </div>
    )

}
export default CustomerSettings;
