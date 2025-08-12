import type {BarcodeItem} from "chums-types";
import {useSelector} from "react-redux";
import {selectCustomerItems} from "./selectors";
import Alert from "react-bootstrap/Alert";

const ExistingItemAlert = ({item}:{item:BarcodeItem}) => {
    const items = useSelector(selectCustomerItems);
    const match = items[item.ItemCode];
    if (!match || match.ID === item.ID) {
        return null;
    }
    return <Alert variant="danger">Item '{item.ItemCode}' already exists for this customer.</Alert>
}

export default ExistingItemAlert;
