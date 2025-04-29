import {RootState} from "../../app/configureStore";
import {QueryStatus} from "@reduxjs/toolkit/query";
import {createSelector} from "@reduxjs/toolkit";
import {SortProps} from "@chumsinc/sortable-tables";
import {SODetailTableField} from "../../types";
import {detailSorter} from "./utils";

export const selectSalesOrder = (state: RootState) => state.salesOrder.orderHeader;

export const selectSalesOrderNo = (state: RootState) => state.salesOrder.salesOrderNo;

export const selectShipTo = (state:RootState) => state.salesOrder.shipTo;
export const selectShipToList = (state:RootState) => state.salesOrder.shipToList;

export const selectDetailSort = (state:RootState):SortProps<SODetailTableField> => state.salesOrder.sort;

export const selectSalesOrderDetail = (state: RootState) => state.salesOrder.detail;

export const selectSalesOrderDetailComments = createSelector(
    [selectSalesOrderDetail],
    (detail) => {
        return detail.filter(row => row.ItemType === '4')
            .sort(detailSorter({field: "SequenceNo", ascending: true}));
    })

export const selectSalesOrderDetailItems = createSelector(
    [selectSalesOrderDetail, selectDetailSort, selectShipTo],
    (detail, sort, shipTo) => {
        return detail
            .filter(row => !shipTo.trim() || row.UDF_SHIP_CODE === shipTo)
            .filter(row => row.ItemType !== '4')
            .sort(detailSorter(sort))
    }
)

export const selectSalesOrderLoading = (state: RootState) => state.salesOrder.loading === QueryStatus.pending;

export const selectSaving = (state: RootState) => state.salesOrder.saving === QueryStatus.pending;

export const selectStickerQty = createSelector(
    [selectSalesOrderDetailItems, selectShipTo], (items, shipTo) => {
        return items
            .filter(row => !shipTo || row.UDF_SHIP_CODE === shipTo)
            .filter(row => row.selected)
            .reduce((count, row) => (row.stickerQty ?? 0) + count, 0);
    })

export const selectQtyGenerated = (state: RootState) => state.salesOrder.qtyGenerated;

export const selectExtraQuantity = (state: RootState) => state.salesOrder.extra;

export const selectIsAllSelected = createSelector(
    [selectSalesOrderDetailItems],
    (detail) => {
        const countSelected = detail.filter(row => row.selected).length;
        const countSelectable = detail.filter(row => !!row.item).length;
        return countSelected === countSelectable && countSelectable > 0;
    }
)

export const selectMissingItems = createSelector(
    [selectSalesOrderDetailItems],
    (detail) => detail.filter(row => !row.item).length
)
