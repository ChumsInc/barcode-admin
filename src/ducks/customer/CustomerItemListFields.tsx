import type {BarcodeCustomerSettings, BarcodeItem} from "chums-types";
import type {SortableTableField} from "@chumsinc/sortable-tables";
import {formatGTIN} from "@chumsinc/gtin-tools";
import ItemStickerIcons from "@/ducks/customer/ItemStickerIcons";
import CustomerItemBadges from "@/components/CustomerItemBadges";
import NotesBadge from "@/components/NotesBadge";
import CustomerItemMSRP from "@/ducks/customer/CustomerItemMSRP";

export const getCustomerColumns = (customer: BarcodeCustomerSettings | null) => {
    const fields: SortableTableField<BarcodeItem>[] = [];
    fields.push({field: 'ItemCode', title: 'Item', sortable: true});
    if (!customer) {
        return fields;
    }
    if (customer.reqItemDescription) {
        fields.push({field: 'ItemDescription', title: 'Description', sortable: true, className: 'text-wrap'});
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
        field: 'itemSticker', title: 'Stickers', render: (row) => <ItemStickerIcons item={row}/>
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
                <NotesBadge note={item.SpecialInstructions} bg="warning"/>
                <NotesBadge note={item.Notes} bg="info"/>
            </>
        )
    })
    return fields;
}
