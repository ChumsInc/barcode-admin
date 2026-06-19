import {useSelector} from "react-redux";
import {customerKey} from "@/utils/customer.ts";
import {selectCustomerSettings} from "@/ducks/customer/customerSettingsSlice.ts";

const CustomerName = () => {
    const current = useSelector(selectCustomerSettings);
    if (!current) {
        return (<h2>Select a customer</h2>);
    }
    return (
        <h2>{current.CustomerName} ({customerKey(current)})</h2>
    )
}

export default CustomerName
