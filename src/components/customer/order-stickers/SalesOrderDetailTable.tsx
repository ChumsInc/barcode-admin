import {ContainedVirtualTable} from "@chumsinc/sortable-tables";
import SalesOrderComments from "./SalesOrderComments.tsx";
import MissingItemAlert from "@/components/customer/order-stickers/MissingItemAlert.tsx";
import SalesOrderCustomerAlert from "./SalesOrderCustomerAlert.tsx";
import classNames from "classnames";
import {useOrderStickers} from "@/components/customer/order-stickers/useOrderStickers.ts";
import {usePrintOptions} from "@/components/customer/order-stickers/usePrintOptions.ts";
import {detailSorter} from "@/ducks/salesOrder/utils.ts";


const SalesOrderDetailTable = () => {
    const {detail} = useOrderStickers();
    const {sort, setSort} = usePrintOptions()

    const lines = detail.filter(row => row.ItemType === '1')
        .filter(row => row.UnitOfMeasure !== 'KIT')
        .sort(detailSorter(sort))
    ;

    return (
        <div>
            <MissingItemAlert/>
            <SalesOrderComments/>
            <SalesOrderCustomerAlert/>
            <ContainedVirtualTable
                data={lines}
                rowHeight={48}
                className="table-hover"
                rowClassName={(row) => classNames({
                    'text-danger': !row.item,
                    'table-secondary': !row.selected
                })}
                keyField="LineKey"
                onChangeSort={(sort) => setSort(sort)}
            />
        </div>
    )

}

export default SalesOrderDetailTable;
