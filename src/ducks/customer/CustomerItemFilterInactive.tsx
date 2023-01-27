import React, {ChangeEvent, MouseEvent} from 'react';
import {useAppDispatch} from "../../app/configureStore";
import {useSelector} from "react-redux";
import {selectItemsFilter, selectItemsShowInactive} from "./selectors";
import {setItemFilter, setItemShowInactive} from "./actions";
import {FormCheck} from "chums-components";

const CustomerItemFilterInactive = () => {
    const dispatch = useAppDispatch();
    const filtered = useSelector(selectItemsShowInactive);

    return (
        <FormCheck type="checkbox" label="Show Inactive" checked={filtered}
                   onChange={(ev) => dispatch(setItemShowInactive(ev.target.checked))} />
    )
}

export default CustomerItemFilterInactive;
