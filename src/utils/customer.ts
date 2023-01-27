import {BarcodeCustomer, BarcodeItem} from "chums-types";
import {BarcodeItemSettingsMap} from "../types";

export const customerKey = (row:Pick<BarcodeCustomer, 'ARDivisionNo'|'CustomerNo'>) => [row.ARDivisionNo, row.CustomerNo].filter(v => !!v).join('-');
export const itemKey = (row:BarcodeItem) => row.ItemCode;

export const itemSettingsMap:BarcodeItemSettingsMap = {
    AltItemCode: 'reqAltItemNumber',
    Color: 'reqColor',
    Custom1: 'reqCustom1',
    Custom2: 'reqCustom2',
    Custom3: 'reqCustom3',
    Custom4: 'reqCustom4',
    CustomerPart: 'reqCustomerPart',
    ItemDescription: 'reqItemDescription',
    MSRP: 'reqMSRP',
    SKU: 'reqSKU',
    UPC: 'reqUPC',
}
