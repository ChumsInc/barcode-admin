import Alert from "react-bootstrap/Alert";
import {useSelector} from "react-redux";
import {selectSalesOrder} from "./selectors";
import {selectCurrentCustomer} from "../customer/selectors";
import {selectCustomerList} from "../customers/selectors";
import {customerKey} from "@/utils/customer";

const SalesOrderCustomerAlert = () => {
    const so = useSelector(selectSalesOrder);
    const settings = useSelector(selectCurrentCustomer);
    const customerList = useSelector(selectCustomerList);

    if (!so || !settings || customerKey(so) === customerKey(settings)) {
        return null;
    }

    const soCustomer = customerKey(so);

    return (
        <Alert variant="warning">
            <div className="row g-3">
                <div className="col-auto bi-shop me-3" />
                <div className="col-auto"><strong className="me-3">{soCustomer} -- {so.BillToName}</strong></div>
                {!!customerList[soCustomer] && !!customerList[soCustomer].SpecialInstructions && (
                    <div className="col">
                        {customerList[soCustomer].SpecialInstructions}
                    </div>
                )}
            </div>
        </Alert>
    )
}

export default SalesOrderCustomerAlert;
