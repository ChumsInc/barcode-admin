import {useAppDispatch, useAppSelector} from "@/app/configureStore.ts";
import {loadCustomer} from "@/ducks/customer/actions.ts";
import Button from "react-bootstrap/Button";
import {selectCustomerSettings, selectCustomerStatus} from "@/ducks/customer/customerSettingsSlice.ts";

export default function ReloadCustomerButton() {
    const dispatch = useAppDispatch();
    const status = useAppSelector(selectCustomerStatus)
    const currentCustomer = useAppSelector(selectCustomerSettings);

    const clickHandler = () => {
        if (!currentCustomer) return;
        dispatch(loadCustomer(currentCustomer?.id))
    }

    if (!currentCustomer) {
        return null;
    }

    return (
        <Button type="button" size="sm" variant="outline-primary"
                disabled={status !== 'idle'}
                onClick={clickHandler}>
            Reload Customer
        </Button>
    )
}
