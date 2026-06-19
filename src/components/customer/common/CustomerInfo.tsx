import {useSelector} from "react-redux";
import CustomerName from "@/components/customer/common/CustomerName.tsx";
import InactiveCustomerAlert from "@/components/customer/common/InactiveCustomerAlert.tsx";
import CustomerNotes from "@/components/customer/common/CustomerNotes.tsx";
import CustomerInstructions from "@/components/customer/common/CustomerInstructions.tsx";
import {selectCustomerSettings} from "@/ducks/customer/customerSettingsSlice.ts";

const CustomerInfo = () => {
    const customer = useSelector(selectCustomerSettings);
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
