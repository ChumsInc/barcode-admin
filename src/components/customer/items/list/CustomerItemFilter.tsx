import {type ChangeEvent, useId} from 'react';
import {useAppDispatch} from "@/app/configureStore.ts";
import {useSelector} from "react-redux";
import {selectItemFilter, setCustomerItemsFilter} from "@/ducks/customer/customerItemsSlice.ts";

export default function CustomerItemFilter(){
    const dispatch = useAppDispatch();
    const id = useId();
    const filter = useSelector(selectItemFilter);
    const changeHandler = (ev: ChangeEvent<HTMLInputElement>) => {
        dispatch(setCustomerItemsFilter(ev.target.value));
    }

    return (
        <div className="input-group input-group-sm">
            <label className="input-group-text" htmlFor={id}>Filter Item</label>
            <input type="search" className="form-control form-control-sm" id={id}
                   onChange={changeHandler} value={filter}/>
        </div>
    )
}
