import SalesOrderControlBar from "../salesOrder/SalesOrderControlBar";
import SalesOrderDetailTable from "../salesOrder/SalesOrderDetailTable";
import {useSelector} from "react-redux";
import {selectCurrentCustomer} from "./selectors";
import CustomerInfo from "./components/customer-items/CustomerInfo.tsx";

const CustomerOrder = () => {
    const customer = useSelector(selectCurrentCustomer);
    return (
        <div>
            <CustomerInfo/>
            {customer?.active && (
                <div>
                    <SalesOrderControlBar/>
                    <SalesOrderDetailTable/>
                </div>
            )}
        </div>
    )
}
export default CustomerOrder;

