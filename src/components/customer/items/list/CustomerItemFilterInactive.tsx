import {type ChangeEvent, useId} from 'react';
import {useAppDispatch} from "@/app/configureStore.ts";
import {useSelector} from "react-redux";
import FormCheck from "react-bootstrap/FormCheck";
import {localStorageKeys} from "@/api/preferences.ts";
import {LocalStore} from "@chumsinc/ui-utils";
import {selectShowInactiveItems, showInactiveCustomerItems} from "@/ducks/customer/customerItemsSlice.ts";

export default function CustomerItemFilterInactive() {
    const dispatch = useAppDispatch();
    const checked = useSelector(selectShowInactiveItems);
    const id = useId();

    const changeHandler = (ev: ChangeEvent<HTMLInputElement>) => {
        LocalStore.setItem<boolean>(localStorageKeys.showInactive, ev.target.checked);
        dispatch(showInactiveCustomerItems(ev.target.checked));
    }

    return (
        <FormCheck type="checkbox" label="Show Inactive" checked={checked} id={id}
                   onChange={changeHandler}/>
    )
}
