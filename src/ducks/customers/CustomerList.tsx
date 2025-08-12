import {useEffect, useState} from 'react';
import {useAppDispatch} from "@/app/configureStore";
import {useSelector} from "react-redux";
import {
    selectCustomerList,
    selectCustomerListFilter,
    selectCustomerListSort,
    selectCustomerRowsPerPage,
    selectCustomersLoaded,
    selectCustomersLoading,
    selectCustomersPage,
    selectShowInactiveCustomers
} from "./selectors";
import {loadCustomers, setCustomersSort, setPage, setRowsPerPage} from "./actions";
import type {BarcodeCustomer} from "chums-types";
import {customerKey} from "@/utils/customer";
import {customerFilter, customerSort} from "./utils";
import type {SortProps} from "../../types";
import {SortableTable, TablePagination} from "@chumsinc/sortable-tables";
import CustomerFilter from "./CustomerFilter";
import {useNavigate} from "react-router";
import CustomerSearchBySO from "./CustomerSearchBySO";
import classNames from "classnames";
import {SpinnerButton} from "@chumsinc/react-bootstrap-addons";
import {customerListFields} from "@/ducks/customers/customerListFields.tsx";


const CustomerList = () => {
    const dispatch = useAppDispatch();
    const nav = useNavigate();
    const list = useSelector(selectCustomerList);
    const loaded = useSelector(selectCustomersLoaded);
    const loading = useSelector(selectCustomersLoading);
    const sort = useSelector(selectCustomerListSort);
    const filter = useSelector(selectCustomerListFilter);
    const page = useSelector(selectCustomersPage);
    const rowsPerPage = useSelector(selectCustomerRowsPerPage);
    const showInactive = useSelector(selectShowInactiveCustomers);


    const [sortedList, setSortedList] = useState<BarcodeCustomer[]>(
        Object.values(list)
            .filter(row => showInactive || row.active)
            .filter(row => !filter || row.CustomerName.includes(filter) || customerKey(row).includes(filter))
            .sort(customerSort(sort))
    )
    const [pagedList, setPagedList] = useState<BarcodeCustomer[]>(sortedList.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage))

    useEffect(() => {
        if (!loading && !loaded) {
            dispatch(loadCustomers());
        }
    }, []);


    useEffect(() => {
        const sortedList = Object.values(list)
            .filter(row => showInactive || row.active)
            .filter(customerFilter(filter))
            .sort(customerSort(sort));
        setSortedList(sortedList);
        setPagedList(sortedList.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage))
    }, [list, sort, filter, page, rowsPerPage, showInactive])

    const sortChangedHandler = (sort: SortProps) => {
        dispatch(setCustomersSort(sort.field as keyof BarcodeCustomer));
    }

    return (
        <div className="container-md">
            <div className="row g-3 mb-3">
                <div className="col">
                    <CustomerFilter/>
                </div>
                <div className="col-auto">
                    <SpinnerButton type="button" size="sm" spinning={loading} spinnerProps={{size: 'sm'}}
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
            <SortableTable fields={customerListFields} data={pagedList}
                           rowClassName={(row) => classNames({'table-warning': !row.active})}
                           currentSort={sort} keyField="id" onChangeSort={sortChangedHandler}/>
            <TablePagination size="sm" page={page} rowsPerPage={rowsPerPage} count={sortedList.length}
                             showFirst showLast
                             onChangePage={(page: number) => dispatch(setPage(page))}
                             rowsPerPageProps={{onChange: (rowsPerPage: number) => dispatch(setRowsPerPage(rowsPerPage))}}/>
        </div>
    )
}

export default CustomerList;
