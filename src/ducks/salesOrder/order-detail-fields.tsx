import type {BarcodeCustomerSettings} from "chums-types";
import type {SortableTableField} from "@chumsinc/sortable-tables";
import type {BarcodeSODetailLine} from "@/src/types.ts";
import StickerSelectToggleAll from "@/components/customer/order-stickers/StickerSelectToggleAll.tsx";
import StickerSelectToggle from "@/components/customer/order-stickers/StickerSelectToggle.tsx";
import StickerItemComment from "@/components/customer/order-stickers/StickerItemComment.tsx";
import StickerQuantityInput from "@/components/customer/order-stickers/StickerQuantityInput.tsx";
import ItemStickerIcons from "@/components/customer/common/ItemStickerIcons.tsx";
import numeral from "numeral";

export const getOrderColumns = (customer: BarcodeCustomerSettings | null):SortableTableField<BarcodeSODetailLine>[] => {
    const fields: SortableTableField<BarcodeSODetailLine>[] = [
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
        {
            field: 'itemSticker',
            title: 'Stickers',
            render: (row: BarcodeSODetailLine) => <ItemStickerIcons item={row.item}/>
        }
    ];
    if (!customer) {
        return fields;
    }
    if (customer.reqItemDescription) {
        fields.push({
            field: 'ItemDescription',
            title: 'Description',
            sortable: true,
            render: (row: BarcodeSODetailLine) => row.item?.ItemDescription ?? null
        });
    }
    if (customer.reqAltItemNumber) {
        fields.push({
            field: 'AltItemCode',
            title: 'Alternate Item',
            sortable: true,
            render: (row: BarcodeSODetailLine) => row.item?.AltItemCode ?? null
        });
    }
    if (customer.reqColor) {
        fields.push({
            field: 'Color',
            title: 'Color',
            sortable: true,
            render: (row: BarcodeSODetailLine) => row.item?.Color ?? null
        });
    }
    if (customer.reqSKU) {
        fields.push({
            field: 'SKU',
            title: 'SKU',
            sortable: true,
            render: (row: BarcodeSODetailLine) => row.item?.SKU ?? null
        });
    }
    if (customer.reqCustomerPart) {
        fields.push({
            field: 'CustomerPart',
            title: 'Customer Part',
            sortable: true,
            render: (row: BarcodeSODetailLine) => row.item?.CustomerPart ?? null
        });
    }
    if (customer.reqUPC) {
        fields.push({
            field: 'UPC',
            title: 'UPC',
            sortable: true,
            render: (row: BarcodeSODetailLine) => row.item?.UPC ?? null
        });
    }
    if (customer.reqMSRP) {
        fields.push({
            field: 'MSRP',
            title: 'MSRP',
            sortable: true,
            align: 'end',
            render: (row: BarcodeSODetailLine) => row.item?.MSRP ? numeral(row.item.MSRP).format('0,0.00') : null,
        });
    }
    if (customer.reqCustom1) {
        fields.push({
            field: 'Custom1',
            title: customer.custom1Name,
            sortable: true,
            render: (row: BarcodeSODetailLine) => row.item?.Custom1 ?? null
        });
    }
    if (customer.reqCustom2) {
        fields.push({
            field: 'Custom2',
            title: customer.custom2Name,
            sortable: true,
            render: (row: BarcodeSODetailLine) => row.item?.Custom2 ?? null
        });
    }
    if (customer.reqCustom3) {
        fields.push({
            field: 'Custom3',
            title: customer.custom3Name,
            sortable: true,
            render: (row: BarcodeSODetailLine) => row.item?.Custom3 ?? null
        });
    }
    if (customer.reqCustom4) {
        fields.push({
            field: 'Custom4',
            title: customer.custom4Name,
            sortable: true,
            render: (row: BarcodeSODetailLine) => row.item?.Custom4 ?? null
        });
    }
    return fields;
}
