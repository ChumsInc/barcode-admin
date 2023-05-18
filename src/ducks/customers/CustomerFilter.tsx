import React, {ChangeEvent} from 'react';
import {useAppDispatch} from "../../app/configureStore";
import {useSelector} from "react-redux";
import {selectCustomerListFilter, selectShowInactiveCustomers} from "./selectors";
import {InputGroup} from "chums-components";
import {setCustomersFilter, toggleShowInactive} from "./actions";
import {selectCanEdit} from "../user";

const CustomerFilter = () => {
    const dispatch = useAppDispatch();
    const filter = useSelector(selectCustomerListFilter);
    const isAdmin = useSelector(selectCanEdit);
    const showInactive = useSelector(selectShowInactiveCustomers);

    const onToggleShowInactive = (ev: ChangeEvent<HTMLInputElement>) => {
        dispatch(toggleShowInactive(ev.target.checked))
    }
    return (
        <InputGroup bsSize="sm">
            <span className="input-group-text bi-funnel-fill"/>
            <input type="search" className="form-control form-control-sm" value={filter}
                   onChange={(ev) => dispatch(setCustomersFilter(ev.target.value))}/>
            {isAdmin && (<div className="input-group-text">
                <span className="me-1">Show Inactive</span>
                <input type="checkbox" className="form-check-input mt-0" checked={showInactive}
                       onChange={onToggleShowInactive}/>
            </div>)}
        </InputGroup>
    )
}

export default CustomerFilter;
