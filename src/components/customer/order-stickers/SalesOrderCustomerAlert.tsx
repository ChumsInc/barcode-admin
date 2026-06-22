import Alert from "react-bootstrap/Alert";
import {useSelector} from "react-redux";
import {customerKey} from "@/utils/customer.ts";
import {selectCustomers} from "@/ducks/customers";
import {selectCustomerSettings} from "@/ducks/customer/customerSettingsSlice.ts";
import {useSalesOrder} from "@/components/customer/order-stickers/useSalesOrder.ts";

const SalesOrderCustomerAlert = () => {
    const {orderHeader} = useSalesOrder();
    const settings = useSelector(selectCustomerSettings);
    const customers = useSelector(selectCustomers);

    if (!orderHeader || !settings || customerKey(orderHeader) === customerKey(settings)) {
        return null;
    }

    const soCustomer = customerKey(orderHeader);
    const customer = customers.find(c => customerKey(c) === soCustomer);

    return (
        <Alert variant="warning">
            <div className="row g-3">
                <div className="col-auto bi-shop me-3"/>
                <div className="col-auto"><strong className="me-3">{soCustomer} -- {orderHeader.BillToName}</strong>
                </div>
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
