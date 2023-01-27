import React from 'react';
import CustomerItemList from "./CustomerItemList";
import ItemEditor from "./ItemEditor";
import CustomerItemFilter from "./CustomerItemFilter";
import CustomerItemFilterInactive from "./CustomerItemFilterInactive";
import CustomerName from "./CustomerName";
import CustomerNotes from "./CustomerNotes";
import CustomerInstructions from "./CustomerInstructions";
import InactiveCustomerAlert from "./InactiveCustomerAlert";
import {useSelector} from "react-redux";
import {selectCurrentCustomer} from "./selectors";
import ReloadCustomerButton from "./ReloadCustomerButton";
import CustomerInfo from "./CustomerInfo";

const CustomerItems = () => {
    const customer = useSelector(selectCurrentCustomer);

    return (
        <div>
            <CustomerInfo />
            <div className="row g-3">
                <div className="col-auto">
                    <CustomerItemFilter/>
                </div>
                <div className="col-auto">
                    <CustomerItemFilterInactive/>
                </div>
                <div className="col-auto">
                    <ReloadCustomerButton/>
                </div>
            </div>
            {customer?.active && (
                <div className="row g-3">
                    <div className="col-6 col-md-7 col-lg-8 col-xl-9">
                        <CustomerItemList/>
                    </div>
                    <div className="col-6 col-md-5 col-lg-4 col-xl-3">
                        <ItemEditor/>
                    </div>
                </div>
            )}
        </div>
    )
}
export default CustomerItems;

