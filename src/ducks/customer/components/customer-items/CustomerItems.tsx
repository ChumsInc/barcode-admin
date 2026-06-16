import CustomerItemList from "./CustomerItemList.tsx";
import ItemEditor from "./ItemEditor.tsx";
import CustomerItemFilter from "./CustomerItemFilter.tsx";
import CustomerItemFilterInactive from "./CustomerItemFilterInactive.tsx";
import {useSelector} from "react-redux";
import {selectCurrentCustomer} from "../../selectors.ts";
import ReloadCustomerButton from "../../ReloadCustomerButton.tsx";
import CustomerInfo from "./CustomerInfo.tsx";
import CustomerProgressBar from "../../CustomerProgressBar.tsx";

const CustomerItems = () => {
    const customer = useSelector(selectCurrentCustomer);

    return (
        <div>
            <CustomerInfo/>
            <div className="row g-3 mt-1">
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
            <CustomerProgressBar />
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

