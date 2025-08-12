import {useEffect, useState} from 'react';
import {useAppDispatch} from "@/app/configureStore";
import {useSelector} from "react-redux";
import {
    selectCurrentCustomer,
    selectCustomerItem,
    selectCustomerLoaded,
    selectCustomerLoading,
    selectFilteredItems,
    selectItemsPage,
    selectItemsRowsPerPage,
    selectItemsSort
} from "./selectors";
import type {BarcodeItem, SortProps} from "chums-types";
import {SortableTable, TablePagination} from "@chumsinc/sortable-tables";
import {loadCustomer, setCurrentItem, setItemSort, setPage, setRowsPerPage} from "./actions";
import classNames from "classnames";
import CustomerItemListContainer from "@/ducks/customer/CustomerItemListContainer";
import {getCustomerColumns} from "@/ducks/customer/CustomerItemListFields";


const CustomerItemList = () => {
    const dispatch = useAppDispatch();
    const currentCustomer = useSelector(selectCurrentCustomer)
    const filteredItems = useSelector(selectFilteredItems);
    const currentItem = useSelector(selectCustomerItem)
    const loaded = useSelector(selectCustomerLoaded);
    const loading = useSelector(selectCustomerLoading);
    const page = useSelector(selectItemsPage);
    const rowsPerPage = useSelector(selectItemsRowsPerPage);
    const [fields, setFields] = useState(getCustomerColumns(currentCustomer));
    const [pagedData, setPagedData] = useState(filteredItems.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage));
    const sort = useSelector(selectItemsSort);

    useEffect(() => {
        if (!loading && !loaded && !!currentCustomer) {
            dispatch(loadCustomer(currentCustomer.id));
        }
    }, [loading, loaded]);

    useEffect(() => {
        setFields(getCustomerColumns(currentCustomer));
    }, [currentCustomer]);


    useEffect(() => {
        const pagedData = filteredItems.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
        setPagedData(pagedData);
    }, [page, rowsPerPage, filteredItems])

    const sortChangeHandler = (nextSort: SortProps<BarcodeItem>) => {
        dispatch(setItemSort(nextSort));
    }

    const selectHandler = (item: BarcodeItem) => {
        dispatch(setCurrentItem(item));
    }

    const rowClassName = (row: BarcodeItem) => {
        return classNames({
            'text-danger': row.InactiveItem === 'Y' || row.ProductType === 'D',
            'text-warning': row.InactiveItem === null,
        })
    }

    return (
        <CustomerItemListContainer>
            <div className="table-responsive">
                <SortableTable fields={fields} data={pagedData} keyField={'ID'}
                               className="bca--customer-item-list"
                               currentSort={sort} onChangeSort={sortChangeHandler}
                               onSelectRow={selectHandler} rowClassName={rowClassName}
                               selected={(row: BarcodeItem) => row.ID === currentItem?.ID}/>
            </div>
            <TablePagination page={page} onChangePage={(page) => dispatch(setPage(page))}
                             rowsPerPage={rowsPerPage}
                             rowsPerPageProps={{onChange: (rpp) => dispatch(setRowsPerPage(rpp))}}
                             showFirst showLast
                             count={filteredItems.length}/>
        </CustomerItemListContainer>
    )

}

export default CustomerItemList;
