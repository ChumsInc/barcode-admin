import React from 'react';
import {useAppDispatch} from "../../app/configureStore";
import {useSelector} from "react-redux";
import {selectCustomerListFilter} from "./selectors";
import {InputGroup} from "chums-components";
import {setCustomersFilter} from "./actions";

const CustomerFilter = () => {
    const dispatch = useAppDispatch();
    const filter = useSelector(selectCustomerListFilter);

    return (
        <InputGroup bsSize="sm">
            <span className="input-group-text bi-funnel-fill" />
            <input type="search" className="form-control form-control-sm" value={filter} onChange={(ev) => dispatch(setCustomersFilter(ev.target.value))} />
        </InputGroup>
    )
}

export default CustomerFilter;
