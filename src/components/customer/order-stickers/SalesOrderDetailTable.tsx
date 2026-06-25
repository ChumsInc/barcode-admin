import {ContainedSortableTable, TablePagination} from "@chumsinc/sortable-tables";
import SalesOrderComments from "./SalesOrderComments.tsx";
import MissingItemAlert from "@/components/customer/order-stickers/MissingItemAlert.tsx";
import SalesOrderCustomerAlert from "./SalesOrderCustomerAlert.tsx";
import classNames from "classnames";
import {useOrderStickers} from "@/components/customer/order-stickers/useOrderStickers.ts";
import {usePrintOptions} from "@/components/customer/order-stickers/usePrintOptions.ts";
import {detailSorter} from "@/components/customer/order-stickers/utils.ts";
import {startTransition, useEffect, useState} from "react";
import {LocalStore} from "@chumsinc/ui-utils";
import {localStorageKeys} from "@/api/preferences.ts";


const SalesOrderDetailTable = () => {
    const {detail} = useOrderStickers();
    const {sort, setSort} = usePrintOptions();
    const [page, setPage] = useState<number>(0);
    const [rowsPerPage, setRowsPerPage] = useState<number>(LocalStore.getItem(localStorageKeys.soRowsPerPage, 25));

    useEffect(() => {
        startTransition(() => {
            setPage(0);
        });
    }, [sort, detail]);

    const handleChangeRowsPerPage = (rpp:number) => {
        LocalStore.setItem(localStorageKeys.soRowsPerPage, rpp);
        setRowsPerPage(rpp);
        setPage(0);
    }

    const lines = detail.filter(row => row.ItemType === '1')
        .filter(row => row.UnitOfMeasure !== 'KIT')
        .filter(row => !row.ItemCode.startsWith('PEG'))
        .filter(row => !row.ItemCode.startsWith('98'))
        .sort(detailSorter(sort))
    ;

    return (
        <div>
            <MissingItemAlert/>
            <SalesOrderComments/>
            <SalesOrderCustomerAlert/>
            <ContainedSortableTable
                data={lines.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)}
                className="table-hover"
                rowClassName={(row) => classNames({
                    'text-danger': !row.item,
                    'table-secondary': !row.selected
                })}
                keyField="LineKey"
                onChangeSort={(sort) => setSort(sort)}
            />
            <TablePagination count={lines.length}
                             page={page} onChangePage={setPage}
                             rowsPerPage={rowsPerPage}
                             rowsPerPageProps={{
                onChange: handleChangeRowsPerPage,
            }}/>
        </div>
    )

}

export default SalesOrderDetailTable;
