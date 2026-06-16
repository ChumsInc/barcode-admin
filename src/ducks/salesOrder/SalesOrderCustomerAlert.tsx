import Alert from "react-bootstrap/Alert";
import {useSelector} from "react-redux";
import {selectSalesOrder} from "./selectors";
import {selectCurrentCustomer} from "../customer/selectors";
import {customerKey} from "@/utils/customer";
import {selectCustomers} from "@/ducks/customers";

const SalesOrderCustomerAlert = () => {
    const so = useSelector(selectSalesOrder);
    const settings = useSelector(selectCurrentCustomer);
    const customers = useSelector(selectCustomers);

    if (!so || !settings || customerKey(so) === customerKey(settings)) {
        return null;
    }

    const soCustomer = customerKey(so);
    const customer = customers.find(c => customerKey(c) === soCustomer);

    return (
        <Alert variant="warning">
            <div className="row g-3">
                <div className="col-auto bi-shop me-3"/>
                <div className="col-auto"><strong className="me-3">{soCustomer} -- {so.BillToName}</strong></div>
                {!!customer?.SpecialInstructions && (
                    <div className="col">
                        {customer.SpecialInstructions}
                    </div>
                )}
            </div>
        </Alert>
    )
}

export default SalesOrderCustomerAlert;
