import {
    BarcodeCustomer,
    BarcodeCustomerSettings,
    BarcodeItem,
    Item,
    PublicUserProps,
    SalesOrder,
    SalesOrderDetailLine,
    WarehouseItem
} from "chums-types";
import {BootstrapColor} from "chums-components";

export interface BarcodeCustomerList {
    [key: string]: BarcodeCustomer;
}

export interface BarcodeItemList {
    [key: string]: BarcodeItem;
}

export interface BarcodeCustomerResponse {
    settings?: BarcodeCustomerSettings | null;
    items?: BarcodeItemList;
}

export interface UserValidationResponse {
    valid?: boolean;
    profile?: {
        user: PublicUserProps;
        roles: string[];
    };
    loaded: string;
}

export interface SageItem extends Item {
    detail: WarehouseItem[];
}

export interface ErrorAlert {
    id: number;
    context: string;
    message: string;
    count: number;
    color?: BootstrapColor;
}

export interface SortProps<T = any> {
    field: keyof T;
    ascending: boolean;
}

export type SearchCustomer = Pick<BarcodeCustomer, 'Company' | 'ARDivisionNo' | 'CustomerNo' | 'CustomerName'>

export type BarcodeItemSettingsMap = {
    [field in keyof BarcodeItem]?: keyof BarcodeCustomerSettings;
};

export interface SalesOrderStickerQty {
    [key: string]: {
        quantity: number | null
        selected: boolean;
    };
}

export interface BarcodeSOLineItem {
    LineKey: string;
    item_id: number;
    quantity: number;
}

export interface GenerateStickerBody {
    CustomerPONo: string;
    lines: BarcodeSOLineItem[],
    reversed?: boolean;
}

export interface GenerateStickerProps {
    customerId: number;
    SalesOrderNo: string;
    CustomerPONo: string;
    lines: BarcodeSOLineItem[],
    reversed?: boolean;
}

export type SalesOrderDetailBarcodeItem = Pick<SalesOrderDetailLine,
    'LineKey' | 'ItemCode' | 'CommentText' | 'ItemType' | 'BinLocation' | 'UnitOfMeasure' | 'UnitOfMeasureConvFactor'
    | 'SequenceNo' | 'WarehouseCode' | 'QuantityOrdered' | 'QuantityShipped'>

export interface BarcodeSODetailLine extends SalesOrderDetailBarcodeItem {
    BinLocation: string;
    Quantity: string | number;
    item?: BarcodeItem;
    selected: boolean;
    stickerQty: number | null;
}

export type BarcodeSalesOrderHeader = Pick<SalesOrder, 'SalesOrderNo' | 'ARDivisionNo' | 'CustomerNo' | 'BillToName' | 'ShipExpireDate' | 'OrderStatus' | 'CustomerPONo'>;

export interface BarcodeSalesOrder {
    header: BarcodeSalesOrderHeader;
    detail: BarcodeSODetailLine[];
}

export type SODetailTableField = BarcodeSODetailLine & Omit<BarcodeItem, 'ItemCode'>;


export type BarcodeType = 'GTIN-12' | 'GTIN-13' | 'GTIN-14' | 'GSIN' | 'SSCC';

export type BarcodeTypeDigits = {
    [key in BarcodeType]: number;
};

export type BarcodeTypeSplits = {
    [key in BarcodeType]?: RegExp;
}


export interface ColorUPCRecord {
    company: string;
    id: number;
    ItemCode: string;
    ItemCodeDesc: string|null;
    upc: string;
    notes: string|null;
    tags: unknown;
    active: boolean;
    ProductType: string|null;
    InactiveItem: string|null;
    UDF_UPC: string|null;
    UDF_UPC_BY_COLOR: string|null;
}
