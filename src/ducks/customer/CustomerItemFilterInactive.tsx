import {useId} from 'react';
import {useAppDispatch} from "@/app/configureStore";
import {useSelector} from "react-redux";
import {selectItemsShowInactive} from "./selectors";
import {setItemShowInactive} from "./actions";
import FormCheck from "react-bootstrap/FormCheck";

const CustomerItemFilterInactive = () => {
    const dispatch = useAppDispatch();
    const filtered = useSelector(selectItemsShowInactive);
    const id = useId();

    return (
        <FormCheck type="checkbox" label="Show Inactive" checked={filtered} id={id}
                   onChange={(ev) => dispatch(setItemShowInactive(ev.target.checked))}/>
    )
}

export default CustomerItemFilterInactive;
