import {SortProps} from "../../types";
import {BarcodeCustomer, BarcodeCustomerSettings} from "chums-types";
import {customerKey} from "../../utils/customer";

export const customerSort = ({field, ascending}: SortProps<BarcodeCustomer>) =>
    (a: BarcodeCustomer, b: BarcodeCustomer):number => {
        const sortMod = ascending ? 1 : -1;
        switch (field) {
        case "CustomerName":
            return (
                a[field].toLowerCase() === b[field].toLowerCase()
                    ? (customerKey(a) > customerKey(b) ? 1 : -1)
                    : (a[field].toLowerCase() > b[field].toLowerCase() ? 1 : -1)
            ) * sortMod;
        case 'ARDivisionNo':
        case 'CustomerNo':
        default:
            return (customerKey(a) > customerKey(b) ? 1 : -1) * sortMod;
        }
    }

export const customerFilter = (filter:string) => (row:BarcodeCustomer) => {
    let reFilter;
    try {
        reFilter = new RegExp(filter, 'i');
    } catch(err:unknown) {}
    return !filter
        || row.CustomerName.toLowerCase().includes(filter.toLowerCase())
        || customerKey(row).includes(filter.toUpperCase())
        || !reFilter
        || reFilter.test(customerKey(row))
        || reFilter.test(row.CustomerName);
}

export const newCustomer:BarcodeCustomerSettings = {
    id: 0,
    ARDivisionNo: '',
    CustomerNo: '',
    CustomerName: '',
    Notes: '',
    SpecialInstructions: '',
    Company: 'chums',
    custom1Name: '',
    custom2Name: '',
    custom3Name: '',
    custom4Name: '',
    reqCustom1: false,
    reqCustom2: false,
    reqCustom3: false,
    reqCustom4: false,
    reqColor: false,
    reqCustomerPart: false,
    reqMSRP: false,
    reqSKU: false,
    reqUPC: false,
    reqItemDescription: false,
    reqAltItemNumber: false,
    active: true,
}
