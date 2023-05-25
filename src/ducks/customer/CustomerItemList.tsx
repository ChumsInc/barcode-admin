import React, {useEffect, useState} from 'react';
import {useAppDispatch} from "../../app/configureStore";
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
import {BarcodeCustomerSettings, BarcodeItem} from "chums-types";
import {SortableTableField} from "chums-components/dist/types";
import {loadCustomer, setCurrentItem, setItemSort, setPage, setRowsPerPage} from "./actions";
import {SortableTable, TablePagination} from "chums-components";
import {SortProps} from "../../types";
import classNames from "classnames";
import CustomerItemBadges from "../../components/CustomerItemBadges";
import Decimal from "decimal.js";
import is_number from "is-number";
import NotesBadge from "../../components/NotesBadge";
import {formatGTIN} from "@chumsinc/gtin-tools";
import ItemStickerIcons from "./ItemStickerIcons";

const CustomerItemMSRP = ({
                              msrp,
                              suggestedRetailPrice
                          }: { msrp: string, suggestedRetailPrice: string | number | null | undefined }) => {
    if (!suggestedRetailPrice || !is_number(msrp)) {
        return <>{msrp}</>;
    }
    return (
        <div className="text-nowrap">
            <span>{msrp}</span>
            {new Decimal(msrp).lt(suggestedRetailPrice) && (
                <span className="ms-1 bi-exclamation-triangle-fill text-danger"/>)}
            {new Decimal(msrp).gt(suggestedRetailPrice) && (
                <span className="ms-1 bi-exclamation-triangle-fill text-success"/>)}
        </div>
    )
}

const getColumns = (customer: BarcodeCustomerSettings | null) => {
    const fields: SortableTableField<BarcodeItem>[] = [];
    fields.push({field: 'ItemCode', title: 'Item', sortable: true});
    if (!customer) {
        return fields;
    }
    if (customer.reqItemDescription) {
        fields.push({field: 'ItemDescription', title: 'Description', sortable: true});
    }
    if (customer.reqAltItemNumber) {
        fields.push({field: 'AltItemCode', title: 'Alternate Item', sortable: true});
    }
    if (customer.reqColor) {
        fields.push({field: 'Color', title: 'Color', sortable: true});
    }
    if (customer.reqSKU) {
        fields.push({field: 'SKU', title: 'SKU', sortable: true});
    }
    if (customer.reqCustomerPart) {
        fields.push({field: 'CustomerPart', title: 'Customer Part', sortable: true});
    }
    if (customer.reqUPC) {
        fields.push({field: 'UPC', title: 'UPC', sortable: true, render: (row) => formatGTIN(row.UPC ?? '')});
    }
    if (customer.reqMSRP) {
        fields.push({
            field: 'MSRP', title: 'MSRP', sortable: true,
            render: (row) => <CustomerItemMSRP msrp={row.MSRP} suggestedRetailPrice={row.SuggestedRetailPrice}/>
        });
    }
    if (customer.reqCustom1) {
        fields.push({field: 'Custom1', title: customer.custom1Name, sortable: true});
    }
    if (customer.reqCustom2) {
        fields.push({field: 'Custom2', title: customer.custom2Name, sortable: true});
    }
    if (customer.reqCustom3) {
        fields.push({field: 'Custom3', title: customer.custom3Name, sortable: true});
    }
    if (customer.reqCustom4) {
        fields.push({field: 'Custom4', title: customer.custom4Name, sortable: true});
    }
    fields.push({
        field: 'itemSticker', title: 'Stickers', render: (row) => <ItemStickerIcons item={row} />
    })
    fields.push({
        field: 'ProductStatus', title: 'Status', sortable: true,
        render: (item) => <CustomerItemBadges inactiveItem={item.InactiveItem}
                                              productType={item.ProductType}
                                              productStatus={item.ProductStatus}/>
    });
    fields.push({
        field: 'SpecialInstructions',
        title: <span className="bi-card-text"/>,
        render: (item) => (
            <>
                <NotesBadge note={item.SpecialInstructions} color="warning"/>
                <NotesBadge note={item.Notes} color="info"/>
            </>
        )
    })
    return fields;
}

const CustomerItemList = () => {
    const dispatch = useAppDispatch();
    const currentCustomer = useSelector(selectCurrentCustomer)
    const filteredItems = useSelector(selectFilteredItems);
    const currentItem = useSelector(selectCustomerItem)
    const loaded = useSelector(selectCustomerLoaded);
    const loading = useSelector(selectCustomerLoading);
    const page = useSelector(selectItemsPage);
    const rowsPerPage = useSelector(selectItemsRowsPerPage);
    const [fields, setFields] = useState(getColumns(currentCustomer));
    const [pagedData, setPagedData] = useState(filteredItems.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage));
    const sort = useSelector(selectItemsSort);

    useEffect(() => {
        if (!loading && !loaded && !!currentCustomer) {
            dispatch(loadCustomer(currentCustomer.id));
        }
    }, [loading, loaded]);

    useEffect(() => {
        setFields(getColumns(currentCustomer));
    }, [currentCustomer]);


    useEffect(() => {
        const pagedData = filteredItems.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
        setPagedData(pagedData);
    }, [page, rowsPerPage, filteredItems])

    const sortChangeHandler = (nextSort: SortProps) => {
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
        <div>
            <div className="table-responsive">
                <SortableTable fields={fields} data={pagedData} keyField={'ID'}
                               className="bca--customer-item-list"
                               currentSort={sort} onChangeSort={sortChangeHandler}
                               onSelectRow={selectHandler} rowClassName={rowClassName}
                               selected={(row: BarcodeItem) => row.ID === currentItem?.ID}/>
            </div>
            <TablePagination page={page} onChangePage={(page) => dispatch(setPage(page))}
                             rowsPerPage={rowsPerPage} onChangeRowsPerPage={(rpp) => dispatch(setRowsPerPage(rpp))}
                             showFirst showLast
                             count={filteredItems.length}/>
        </div>
    )

}

export default CustomerItemList;
