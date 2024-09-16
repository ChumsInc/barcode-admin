import React, {useEffect, useState} from 'react';
import {SortableTableField} from "chums-components/dist/types";
import {BarcodeCustomerSettings, BarcodeItem} from "chums-types";
import {BarcodeSODetailLine, SODetailTableField} from "../../types";
import StickerQuantityInput from "./StickerQuantityInput";
import {useAppDispatch} from "../../app/configureStore";
import {useSelector} from "react-redux";
import {
    selectDetailSort,
    selectSalesOrder,
    selectSalesOrderDetailComments,
    selectSalesOrderDetailItems
} from "./selectors";
import {selectCurrentCustomer} from "../customer/selectors";
import {SortableTable, TablePagination} from "chums-components";
import {setLineSort} from "./actions";
import StickerSelectToggle from "./StickerSelectToggle";
import StickerSelectToggleAll from "./StickerSelectToggleAll";
import SalesOrderComments from "./SalesOrderComments";
import StickerItemComment from "./StickerItemComment";
import MissingItemAlert from "./MissingItemAlert";
import SalesOrderCustomerAlert from "./SalesOrderCustomerAlert";
import classNames from "classnames";
import ItemStickerIcons from "../customer/ItemStickerIcons";

const getColumns = (customer: BarcodeCustomerSettings | null) => {
    const fields: (SortableTableField<SODetailTableField>|SortableTableField<Omit<BarcodeItem, 'ItemCode'>>)[] = [
        {
            field: 'LineKey',
            title: <StickerSelectToggleAll/>,
            sortable: false,
            render: (row) => <StickerSelectToggle lineKey={row.LineKey}/>
        },
        {
            field: 'SequenceNo',
            title: "Line",
            sortable: true,
            render: (row) => row.LineKey,
        },
        {
            field: 'ItemCode', title: 'Item', sortable: true, render: (row) => (
                <StickerItemComment lineKey={row.LineKey} itemCode={row.ItemCode} commentText={row.CommentText}
                                    notes={row.item?.Notes} specialInstructions={row.item?.SpecialInstructions}/>
            )
        },
        {field: 'WarehouseCode', title: 'Whse', sortable: true},
        {field: 'BinLocation', title: 'Bin', sortable: true},
        {field: 'Quantity', title: 'Quantity', sortable: true, className: 'text-end'},
        {field: 'UnitOfMeasure', title: 'U/M', className: 'text-end'},
        {
            field: 'stickerQty', title: 'Sticker Qty', sortable: true,
            render: (row) => (
                <StickerQuantityInput lineKey={row.LineKey} stickerQty={row.stickerQty}
                                      disabled={!row.item || row.ItemType !== '1'}/>
            )
        },
        {field: 'itemSticker', title: 'Stickers', render: (row:BarcodeSODetailLine) => <ItemStickerIcons item={row.item} />}
    ];
    if (!customer) {
        return fields;
    }
    if (customer.reqItemDescription) {
        fields.push({
            field: 'ItemDescription',
            title: 'Description',
            sortable: true,
            render: (row:BarcodeSODetailLine) => row.item?.ItemDescription ?? null
        });
    }
    if (customer.reqAltItemNumber) {
        fields.push({
            field: 'AltItemCode',
            title: 'Alternate Item',
            sortable: true,
            render: (row:BarcodeSODetailLine) => row.item?.AltItemCode ?? null
        });
    }
    if (customer.reqColor) {
        fields.push({field: 'Color', title: 'Color', sortable: true, render: (row:BarcodeSODetailLine) => row.item?.Color ?? null});
    }
    if (customer.reqSKU) {
        fields.push({field: 'SKU', title: 'SKU', sortable: true, render: (row:BarcodeSODetailLine) => row.item?.SKU ?? null});
    }
    if (customer.reqCustomerPart) {
        fields.push({
            field: 'CustomerPart',
            title: 'Customer Part',
            sortable: true,
            render: (row:BarcodeSODetailLine) => row.item?.CustomerPart ?? null
        });
    }
    if (customer.reqUPC) {
        fields.push({field: 'UPC', title: 'UPC', sortable: true, render: (row:BarcodeSODetailLine) => row.item?.UPC ?? null});
    }
    if (customer.reqMSRP) {
        fields.push({
            field: 'MSRP', title: 'MSRP', sortable: true, render: (row:BarcodeSODetailLine) => row.item?.MSRP ?? null
        });
    }
    if (customer.reqCustom1) {
        fields.push({
            field: 'Custom1',
            title: customer.custom1Name,
            sortable: true,
            render: (row:BarcodeSODetailLine) => row.item?.Custom1 ?? null
        });
    }
    if (customer.reqCustom2) {
        fields.push({
            field: 'Custom2',
            title: customer.custom2Name,
            sortable: true,
            render: (row:BarcodeSODetailLine) => row.item?.Custom2 ?? null
        });
    }
    if (customer.reqCustom3) {
        fields.push({
            field: 'Custom3',
            title: customer.custom3Name,
            sortable: true,
            render: (row:BarcodeSODetailLine) => row.item?.Custom3 ?? null
        });
    }
    if (customer.reqCustom4) {
        fields.push({
            field: 'Custom4',
            title: customer.custom4Name,
            sortable: true,
            render: (row:BarcodeSODetailLine) => row.item?.Custom4 ?? null
        });
    }
    return fields;
}

const SalesOrderDetailTable = () => {
    const dispatch = useAppDispatch();
    const settings = useSelector(selectCurrentCustomer);
    const sort = useSelector(selectDetailSort);
    const so = useSelector(selectSalesOrder);
    const detail = useSelector(selectSalesOrderDetailItems);
    const comments = useSelector(selectSalesOrderDetailComments);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(25);
    const [fields, setFields] = useState(getColumns(settings));
    const [shipTo, setShipTo] = useState('');

    useEffect(() => {
        setFields(getColumns(settings));
    }, [settings])

    useEffect(() => {
        setPage(0);
    }, [sort]);

    const pageChangeHandler = (page: number) => setPage(page);

    const rowsPerPageChangeHandler = (rowsPerPage: number) => {
        setPage(0);
        setRowsPerPage(rowsPerPage);
    }

    return (
        <div>
            <MissingItemAlert/>
            <SalesOrderComments/>
            <SalesOrderCustomerAlert/>
            <TablePagination page={page} onChangePage={pageChangeHandler} rowsPerPage={rowsPerPage}

                             onChangeRowsPerPage={rowsPerPageChangeHandler} count={detail.length}/>
            <SortableTable<any> fields={fields} data={detail.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)} className="table-hover"
                           rowClassName={(row) => classNames({'text-danger': !row.item, 'table-warning': !row.selected})}
                           currentSort={sort} keyField="LineKey" onChangeSort={(sort) => dispatch(setLineSort(sort))}
            />
        </div>
    )

}

export default SalesOrderDetailTable;
