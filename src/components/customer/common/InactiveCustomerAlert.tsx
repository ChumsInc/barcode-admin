import {useSelector} from "react-redux";
import Alert from "react-bootstrap/Alert";
import {selectCustomerSettings} from "@/ducks/customer/customerSettingsSlice.ts";

const InactiveCustomerAlert = () => {
    const customer = useSelector(selectCustomerSettings);
    if (!customer || customer.active) {
        return null;
    }

    return (
        <Alert variant="warning"><span className="bi-toggle-off"></span> This account is disabled.</Alert>
    )
}
export default InactiveCustomerAlert;
