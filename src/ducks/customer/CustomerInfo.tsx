import {useSelector} from "react-redux";
import {selectCurrentCustomer} from "./selectors";
import CustomerName from "./CustomerName";
import InactiveCustomerAlert from "./InactiveCustomerAlert";
import CustomerNotes from "./CustomerNotes";
import CustomerInstructions from "./CustomerInstructions";

const CustomerInfo = () => {
    const customer = useSelector(selectCurrentCustomer);
    if (!customer) {
        return null;
    }

    return (
        <>
            <CustomerName/>
            <InactiveCustomerAlert/>
            <div className="row g-3">
                {!!customer?.Notes && (
                    <div className="col">
                        <CustomerNotes/>
                    </div>
                )}
                {!!customer?.SpecialInstructions && (
                    <div className="col">
                        <CustomerInstructions/>
                    </div>
                )}
            </div>
        </>
    )
}

export default CustomerInfo;
