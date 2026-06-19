import {useAppDispatch} from "@/app/configureStore.ts";
import {useSelector} from "react-redux";
import {selectCustomersSort, selectCustomersStatus, selectSortedCustomers, setCustomerSort} from "@/ducks/customers";
import {loadCustomers} from "@/ducks/customers/actions.ts";
import type {BarcodeCustomer, SortProps} from "chums-types";
import {VirtualTable} from "@chumsinc/sortable-tables";
import CustomerFilter from "@/components/customer/list/CustomerFilter.tsx";
import {useNavigate} from "react-router";
import CustomerSearchBySO from "@/components/customer/list/CustomerSearchBySO.tsx";
import classNames from "classnames";
import {SpinnerButton} from "@chumsinc/react-bootstrap-addons";
import {customerListFields} from "@/components/customer/list/customerListFields.tsx";


const CustomerList = () => {
    const dispatch = useAppDispatch();
    const nav = useNavigate();
    const list = useSelector(selectSortedCustomers);
    const status = useSelector(selectCustomersStatus);
    const sort = useSelector(selectCustomersSort);

    const sortChangedHandler = (sort: SortProps<BarcodeCustomer>) => {
        dispatch(setCustomerSort(sort));
    }

    return (
        <div className="container-md">
            <div className="row g-3 mb-3">
                <div className="col">
                    <CustomerFilter/>
                </div>
                <div className="col-auto">
                    <SpinnerButton type="button" size="sm" spinning={status === 'loading'} spinnerProps={{size: 'sm'}}
                                   onClick={() => dispatch(loadCustomers())}>
                        Reload
                    </SpinnerButton>
                </div>
                <div className="col-auto">
                    <button type="button" className="btn btn-sm btn-outline-secondary"
                            onClick={() => nav('/0/settings')}>New Customer
                    </button>
                </div>
                <div className="col-4">
                    <CustomerSearchBySO/>
                </div>
            </div>
            <VirtualTable fields={customerListFields}
                          data={list}
                          containerProps={{style: {maxHeight: '75vh'}}}
                          rowClassName={(row) => classNames({'table-warning': !row.active})}
                          currentSort={sort} keyField="id" onChangeSort={sortChangedHandler}/>
        </div>
    )
}

export default CustomerList;
