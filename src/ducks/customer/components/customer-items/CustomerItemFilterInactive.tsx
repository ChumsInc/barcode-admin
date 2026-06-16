import {type ChangeEvent, useId} from 'react';
import {useAppDispatch} from "@/app/configureStore.ts";
import {useSelector} from "react-redux";
import {selectItemsShowInactive} from "../../selectors.ts";
import {setItemShowInactive} from "../../actions.ts";
import FormCheck from "react-bootstrap/FormCheck";
import {localStorageKeys} from "@/api/preferences.ts";
import {LocalStore} from "@chumsinc/ui-utils";

const CustomerItemFilterInactive = () => {
    const dispatch = useAppDispatch();
    const filtered = useSelector(selectItemsShowInactive);
    const id = useId();

    const changeHandler = (ev: ChangeEvent<HTMLInputElement>) => {
        LocalStore.setItem<boolean>(localStorageKeys.showInactive, ev.target.checked);
        dispatch(setItemShowInactive(ev.target.checked));
    }
    return (
        <FormCheck type="checkbox" label="Show Inactive" checked={filtered} id={id}
                   onChange={changeHandler}/>
    )
}

export default CustomerItemFilterInactive;
