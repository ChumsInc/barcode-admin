import {SortProps} from "../../types";
import {BarcodeItem} from "chums-types";

const statusValue = (item: BarcodeItem) => `${!item.ProductType ? 'A' : '_'}`
    + `${item.ProductType === 'D' ? 'D' : '_'}`
    + `${item.InactiveItem === 'Y' ? 'Y' : '_'}`
    + `${!item.ProductStatus ? '_' : item.ProductStatus}`;

export const itemSorter = ({field, ascending}: SortProps<BarcodeItem>) =>
    (a: BarcodeItem, b: BarcodeItem) => {
        const sortMod = ascending ? 1 : -1;
        switch (field) {
            case 'ID':
            case 'CustomerID':
            case 'timestamp':
            case "SuggestedRetailPrice":
            case 'itemSticker':
            case 'bagSticker':
            case 'caseSticker':
                return (a.ID - b.ID) * sortMod;
            case 'ProductStatus':
            case 'InactiveItem':
            case 'ProductType':
                return (
                    statusValue(a) === statusValue(b)
                        ? (
                            a.ItemCode.toLowerCase() === b.ItemCode.toLowerCase()
                                ? (a.ID - b.ID)
                                : 0)
                        : (statusValue(a) > statusValue(b) ? 1 : -1)
                ) * sortMod;
            default:
                return (
                    a[field].toLowerCase() === b[field].toLowerCase()
                        ? (
                            a.ItemCode.toLowerCase() === b.ItemCode.toLowerCase()
                                ? (a.ID - b.ID)
                                : 0)
                        : (a[field].toLowerCase() > b[field].toLowerCase() ? 1 : -1)
                ) * sortMod;
        }
    }

export const itemFilter = (filter: string) => (item: BarcodeItem) => {
    return item.ItemCode.toLowerCase().includes(filter.toLowerCase())
        || item.ItemDescription.toLowerCase().includes(filter.toLowerCase())
        || item.UPC.toLowerCase().includes(filter.toLowerCase());
}

export const newItem: BarcodeItem = {
    ID: 0,
    CustomerID: 0,
    ItemCode: '',
    AltItemCode: '',
    ItemDescription: '',
    Color: '',
    SKU: '',
    CustomerPart: '',
    UPC: '',
    MSRP: '',
    SpecialInstructions: '',
    Notes: '',
    Custom1: '',
    Custom2: '',
    Custom3: '',
    Custom4: '',
}
