import {useAppDispatch} from "@/app/configureStore";
import {loadCustomer} from "./actions";
import {useSelector} from "react-redux";
import {selectCurrentCustomer} from "./selectors";
import Button from "@mui/material/Button";

const ReloadCustomerButton = () => {
    const dispatch = useAppDispatch();
    const currentCustomer = useSelector(selectCurrentCustomer);

    if (!currentCustomer) {
        return null;
    }

    return (
        <Button type="button" size="small" variant="text"
                onClick={() => dispatch(loadCustomer(currentCustomer?.id))}>
            Reload Customer
        </Button>
    )
}

export default ReloadCustomerButton
