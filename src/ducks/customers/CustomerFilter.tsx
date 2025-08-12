import {type ChangeEvent, useId} from 'react';
import {useAppDispatch} from "@/app/configureStore";
import {useSelector} from "react-redux";
import {selectCustomerListFilter, selectShowInactiveCustomers} from "./selectors";
import InputGroup from "react-bootstrap/InputGroup";
import {setCustomersFilter, toggleShowInactive} from "./actions";
import {selectCanEdit} from "../user";
import {FormControl} from "react-bootstrap";

const CustomerFilter = () => {
    const dispatch = useAppDispatch();
    const filter = useSelector(selectCustomerListFilter);
    const isAdmin = useSelector(selectCanEdit);
    const showInactive = useSelector(selectShowInactiveCustomers);
    const idSearch = useId();
    const idShowInactive = useId();

    const onToggleShowInactive = (ev: ChangeEvent<HTMLInputElement>) => {
        dispatch(toggleShowInactive(ev.target.checked))
    }
    return (
        <InputGroup size="sm">
            <InputGroup.Text as="label" htmlFor={idSearch} aria-label="Filter">
                <span className="bi-funnel-fill" aria-hidden />
            </InputGroup.Text>
            <FormControl type="search" size="sm" value={filter}
                   onChange={(ev) => dispatch(setCustomersFilter(ev.target.value))}/>
            {isAdmin && (
                <>
                <InputGroup.Text className="input-group-text" as="label" htmlFor={idShowInactive}>
                    Show Inactive
                </InputGroup.Text>
                <InputGroup.Checkbox id={idShowInactive} checked={showInactive}
                       onChange={onToggleShowInactive}/>
                </>)}
        </InputGroup>
    )
}

export default CustomerFilter;
