import {useState} from 'react';
import {useAppDispatch} from "@/app/configureStore";
import {useSelector} from "react-redux";
import {selectCustomersSort, selectCustomersStatus, selectSortedCustomers, setCustomerSort} from "./index.ts";
import {loadCustomers} from "./actions";
import type {BarcodeCustomer, SortProps} from "chums-types";
import {SortableTable, TablePagination} from "@chumsinc/sortable-tables";
import CustomerFilter from "./CustomerFilter";
import {useNavigate} from "react-router";
import CustomerSearchBySO from "./CustomerSearchBySO";
import classNames from "classnames";
import {SpinnerButton} from "@chumsinc/react-bootstrap-addons";
import {customerListFields} from "@/ducks/customers/customerListFields.tsx";
import {LocalStore} from "@chumsinc/ui-utils";
import {localStorageKeys} from "@/api/preferences.ts";


const CustomerList = () => {
    const dispatch = useAppDispatch();
    const nav = useNavigate();
    const list = useSelector(selectSortedCustomers);
    const status = useSelector(selectCustomersStatus);
    const sort = useSelector(selectCustomersSort);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(LocalStore.getItem(localStorageKeys.customerRowsPerPage, 25));


    const sortChangedHandler = (sort: SortProps<BarcodeCustomer>) => {
        dispatch(setCustomerSort(sort));
    }

    const rowsPerPageHandler = (rowsPerPage: number) => {
        LocalStore.setItem(localStorageKeys.customerRowsPerPage, rowsPerPage);
        setRowsPerPage(rowsPerPage);
        setPage(0);
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
            <SortableTable fields={customerListFields}
                           data={list.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)}
                           rowClassName={(row) => classNames({'table-warning': !row.active})}
                           currentSort={sort} keyField="id" onChangeSort={sortChangedHandler}/>
            <TablePagination size="sm" page={page} rowsPerPage={rowsPerPage} count={list.length}
                             showFirst showLast
                             onChangePage={setPage}
                             rowsPerPageProps={{onChange: rowsPerPageHandler}}/>
        </div>
    )
}

export default CustomerList;
