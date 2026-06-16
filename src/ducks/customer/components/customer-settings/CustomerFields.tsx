import {useEditorContext} from "@/hooks/editor/useEditorContext.ts";
import type {BarcodeCustomerSettings} from "chums-types";
import {useAppSelector} from "@/app/configureStore.ts";
import {selectCanEdit} from "@/ducks/user";
import {type ChangeEvent, useId} from "react";
import FormCheck from "react-bootstrap/esm/FormCheck";
import CustomOptionSetting from "@/components/CustomOptionSetting.tsx";

export default function CustomerFields() {
    const {value: customer, updateValue} = useEditorContext<BarcodeCustomerSettings>();
    const canEdit = useAppSelector(selectCanEdit);
    const idReqAltItemCode = useId();
    const idReqDescription = useId();
    const idReqColor = useId();
    const idReqSKU = useId();
    const idReqCustomerPart = useId();
    const idReqUPC = useId();
    const idReqMSRP = useId();


    const changeHandler = (field: keyof BarcodeCustomerSettings) => (ev: ChangeEvent<HTMLInputElement>) => {
        switch (field) {
            case 'reqAltItemNumber':
            case 'reqItemDescription':
            case 'reqColor':
            case 'reqSKU':
            case 'reqCustomerPart':
            case 'reqUPC':
            case 'reqMSRP':
            case 'reqCustom1':
            case 'reqCustom2':
            case 'reqCustom3':
            case 'reqCustom4':
                updateValue({[field]: ev.target.checked});
                return;
        }
        updateValue({[field]: ev.target.value});
    }

    return (
        <div className="row g-3">
            <div className="col-lg-4">
                <div className="my-1">
                    <FormCheck type="checkbox" label="Item Code" checked={true} readOnly/>
                </div>
                <div className="my-1">
                    <FormCheck type="checkbox" label="Alt Item No" id={idReqAltItemCode}
                               checked={customer.reqAltItemNumber}
                               onChange={changeHandler('reqAltItemNumber')} readOnly={!canEdit}/>
                </div>
                <div className="my-1">
                    <FormCheck type="checkbox" label="Description" id={idReqDescription}
                               checked={customer.reqItemDescription}
                               onChange={changeHandler('reqItemDescription')} readOnly={!canEdit}/>
                </div>
                <div className="my-1">
                    <FormCheck type="checkbox" label="Color" id={idReqColor}
                               checked={customer.reqColor}
                               onChange={changeHandler('reqColor')} readOnly={!canEdit}/>
                </div>
                <div className="my-1">
                </div>
            </div>
            <div className="col-lg-4">
                <div className="my-1">
                    <FormCheck type="checkbox" label="SKU" id={idReqSKU}
                               checked={customer.reqSKU}
                               onChange={changeHandler('reqSKU')} readOnly={!canEdit}/>
                </div>
                <div className="my-1">
                    <FormCheck type="checkbox" label="Customer Part No" id={idReqCustomerPart}
                               checked={customer.reqCustomerPart}
                               onChange={changeHandler('reqCustomerPart')} readOnly={!canEdit}/>
                </div>
                <div className="my-1">
                    <FormCheck type="checkbox" label="UPC" id={idReqUPC}
                               checked={customer.reqUPC}
                               onChange={changeHandler('reqUPC')} readOnly={!canEdit}/>
                </div>
                <div className="my-1">
                    <FormCheck type="checkbox" label="MSRP" id={idReqMSRP}
                               checked={customer.reqMSRP}
                               onChange={changeHandler('reqMSRP')} readOnly={!canEdit}/>
                </div>
            </div>
            <div className="col-lg-4">
                <div className="my-1">
                    <CustomOptionSetting name="Custom 1"
                                         required={customer.reqCustom1}
                                         onChangeRequired={changeHandler('reqCustom1')}
                                         value={customer.custom1Name}
                                         onChangeValue={changeHandler('custom1Name')}/>
                </div>
                <div className="my-1">
                    <CustomOptionSetting name="Custom 2"
                                         required={customer.reqCustom2}
                                         onChangeRequired={changeHandler('reqCustom2')}
                                         value={customer.custom2Name}
                                         onChangeValue={changeHandler('custom2Name')}/>
                </div>
                <div className="my-1">
                    <CustomOptionSetting name="Custom 3"
                                         required={customer.reqCustom3}
                                         onChangeRequired={changeHandler('reqCustom3')}
                                         value={customer.custom3Name}
                                         onChangeValue={changeHandler('custom3Name')}/>

                </div>
                <div className="my-1">
                    <CustomOptionSetting name="Custom 4"
                                         required={customer.reqCustom4}
                                         onChangeRequired={changeHandler('reqCustom4')}
                                         value={customer.custom4Name}
                                         onChangeValue={changeHandler('custom4Name')}/>
                </div>
            </div>
        </div>
    )
}
