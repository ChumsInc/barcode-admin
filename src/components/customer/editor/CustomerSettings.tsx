import type {BarcodeCustomerSettings} from "chums-types";
import {useSelector} from "react-redux";
import {customerKey} from "@/utils/customer.ts";
import InactiveCustomerAlert from "@/components/customer/common/InactiveCustomerAlert.tsx";
import {selectCanEdit} from "@/ducks/user";
import Alert from "react-bootstrap/Alert";
import {ErrorBoundary} from "react-error-boundary";
import Button from "react-bootstrap/Button";
import CustomerId from "@/components/customer/editor/CustomerId.tsx";
import CustomerName from "@/components/customer/editor/CustomerName.tsx";
import CustomerNoInput from "@/components/customer/editor/CustomerNoInput.tsx";
import CustomerStatusCheckbox from "@/components/customer/editor/CustomerStatusCheckbox.tsx";
import {useCustomerSettings} from "@/components/customer/hooks/useCustomerSettings.ts";
import {useEditorContext} from "@/hooks/editor/useEditorContext.ts";
import CustomerNotes from "@/components/customer/editor/CustomerNotes.tsx";
import CustomerSpecialInstructions from "@/components/customer/editor/CustomerSpecialInstructions.tsx";
import CustomerFields from "@/components/customer/editor/CustomerFields.tsx";
import CustomerStickerSettings from "@/components/customer/editor/CustomerStickerSettings.tsx";
import {Fade, ProgressBar} from "react-bootstrap";
import CustomerExistsAlert from "@/components/customer/editor/CustomerExistsAlert.tsx";
import AppErrorAlert from "@/app/AppErrorAlert.tsx";
import {selectItemsCount} from "@/ducks/customer/customerItemsSlice.ts";


const CustomerSettings = () => {
    const {status, save, load, customerExists} = useCustomerSettings();
    const {value, changed} = useEditorContext<BarcodeCustomerSettings>();
    const canEdit = useSelector(selectCanEdit);
    const itemsCount = useSelector(selectItemsCount);

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
