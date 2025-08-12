import {useSelector} from "react-redux";
import {selectCurrentCustomer} from "./selectors";
import {customerKey} from "@/utils/customer";

const CustomerName = () => {
    const current = useSelector(selectCurrentCustomer);
    if (!current) {
        return (<h2>Select a customer</h2>);
    }
    return (
        <h2>{current.CustomerName} ({customerKey(current)})</h2>
    )
}

export default CustomerName
