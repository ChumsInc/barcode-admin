import React, {useEffect, useState} from 'react';
import {useAppDispatch} from "../../app/configureStore";
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
import {BarcodeCustomer} from "chums-types";
import {customerKey} from "../../utils/customer";
import {customerFilter, customerSort} from "./utils";
import {SortProps} from "../../types";
import {SortableTable, SortableTableField, TablePagination} from "@chumsinc/sortable-tables";
import CustomerFilter from "./CustomerFilter";
import {Link, useNavigate} from "react-router";
import NotesBadge from "../../components/NotesBadge";
import CustomerSearchBySO from "./CustomerSearchBySO";
import classNames from "classnames";
import {SpinnerButton} from "@chumsinc/react-bootstrap-addons";


const tableFields: SortableTableField<BarcodeCustomer>[] = [
    {
        id: 0,
        field: 'CustomerNo',
        title: 'Customer No',
        sortable: true,
        render: (row) => (<Link to={`/${row.id}/settings`}>{customerKey(row)}</Link>)
    },
    {
        id: 1,
        field: 'CustomerName',
        title: 'Customer Name',
        sortable: true,
        render: (row) => (<Link to={`/${row.id}/settings`}>{row.CustomerName}</Link>)
    },
    {id: 3, field: 'CustomerNo', title: 'Orders', render: (row) => <Link to={`/${row.id}/orders`}>Orders</Link>},
    {id: 4, field: 'CustomerNo', title: 'Items', render: (row) => <Link to={`/${row.id}/items`}>Items</Link>},
    {
        id: 2,
        field: 'Notes',
        title: 'Notes/Instructions',
        sortable: true,
        render: (row) => (<div className="d-flex flex-nowrap gap-3">
            <NotesBadge note={row.Notes}/><NotesBadge note={row.SpecialInstructions} bg="warning"/>
        </div>)
    },
];

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
            <SortableTable fields={tableFields} data={pagedList}
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
