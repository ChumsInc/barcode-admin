import {useSelector} from "react-redux";
import {selectCurrentCustomer} from "../../selectors.ts";
import CustomerName from "../../CustomerName.tsx";
import InactiveCustomerAlert from "../../InactiveCustomerAlert.tsx";
import CustomerNotes from "../../CustomerNotes.tsx";
import CustomerInstructions from "./CustomerInstructions.tsx";

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
