import type {BarcodeCustomerSettings} from "chums-types";
import {useSelector} from "react-redux";
import {selectCustomerItemsCount} from "../../selectors.ts";
import {customerKey} from "@/utils/customer.ts";
import InactiveCustomerAlert from "../../InactiveCustomerAlert.tsx";
import {selectCanEdit} from "../../../user";
import Alert from "react-bootstrap/Alert";
import {ErrorBoundary} from "react-error-boundary";
import Button from "react-bootstrap/Button";
import CustomerId from "@/ducks/customer/components/customer-settings/CustomerId.tsx";
import CustomerName from "@/ducks/customer/components/customer-settings/CustomerName.tsx";
import CustomerNoInput from "@/ducks/customer/components/customer-settings/CustomerNoInput.tsx";
import CustomerStatusCheckbox from "@/ducks/customer/components/customer-settings/CustomerStatusCheckbox.tsx";
import {useCustomerSettings} from "@/ducks/customer/components/customer-settings/useCustomerSettings.ts";
import {useEditorContext} from "@/hooks/editor/useEditorContext.ts";
import CustomerNotes from "@/ducks/customer/components/customer-settings/CustomerNotes.tsx";
import CustomerSpecialInstructions from "@/ducks/customer/components/customer-settings/CustomerSpecialInstructions.tsx";
import CustomerFields from "@/ducks/customer/components/customer-settings/CustomerFields.tsx";
import CustomerStickerSettings from "@/ducks/customer/components/customer-settings/CustomerStickerSettings.tsx";
import {Fade, ProgressBar} from "react-bootstrap";
import CustomerExistsAlert from "@/ducks/customer/components/customer-settings/CustomerExistsAlert.tsx";
import AppErrorAlert from "@/app/AppErrorAlert.tsx";


const CustomerSettings = () => {
    const {status, save, load, customerExists} = useCustomerSettings();
    const {value, changed} = useEditorContext<BarcodeCustomerSettings>();
    const canEdit = useSelector(selectCanEdit);
    const itemsCount = useSelector(selectCustomerItemsCount);

    const saveHandler = () => {
        if (!canEdit) {
            return;
        }
        if (!customerKey(value)) {
            return;
        }
        save(value);
    }

    const reloadHandler = () => {
        load(value.id);
    }

    return (

        <div className="container">
            <ErrorBoundary FallbackComponent={AppErrorAlert}>
                <form action={saveHandler}>
                    <div className="row g-3 align-items-center">
                        <div className="col-auto">
                            <CustomerName/>
                        </div>
                        <div className="col">
                            <Fade in={changed}>
                                <div>
                                    <Alert variant="warning" className="mb-0">
                                        <strong className="me-3">Changed!</strong>Don't forget to save.
                                    </Alert>
                                </div>
                            </Fade>
                        </div>
                    </div>
                    <div className="row g-3 align-items-center mt-1 mb-1">
                        <div className="col-auto">
                            <CustomerId/>
                        </div>
                        <div className="col-auto">
                            <CustomerNoInput/>
                        </div>
                        <div className="col-auto">
                            <CustomerStatusCheckbox/>
                        </div>
                        <div className="col"/>
                        <div className="col-auto">
                            <Button type="submit" variant="primary" size="sm" disabled={customerExists}>
                                Save
                            </Button>
                        </div>
                        <div className="col-auto">
                            <Button type="button" variant="outline-primary" size="sm"
                                    onClick={reloadHandler}
                                    disabled={value.id === 0}>
                                Reload Customer
                            </Button>
                        </div>
                    </div>
                    <Fade in={status !== 'idle'}>
                        <ProgressBar animated now={100} label={`${status}...`}/>
                    </Fade>
                    <InactiveCustomerAlert/>
                    <CustomerExistsAlert/>
                    <div className="row g-3 mt-1">
                        <div className="col-lg-6">
                            <CustomerNotes/>
                        </div>
                        <div className="col-lg-6">
                            <CustomerSpecialInstructions/>
                        </div>
                    </div>
                    <div className="mt-3">
                        <h4>Customer Fields</h4>
                    </div>
                    <CustomerFields/>
                    <div className="mt-3">
                        <hr/>
                        <h4>Customer Sticker Settings</h4>
                        <CustomerStickerSettings/>
                    </div>
                </form>
            </ErrorBoundary>

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
