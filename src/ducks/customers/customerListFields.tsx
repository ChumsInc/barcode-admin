import type {SortableTableField} from "@chumsinc/sortable-tables";
import type {BarcodeCustomer} from "chums-types";
import {Link} from "react-router";
import {customerKey} from "@/utils/customer.ts";
import NotesBadge from "@/components/NotesBadge.tsx";

export const customerListFields: SortableTableField<BarcodeCustomer>[] = [
    {
        id: 0,
        field: 'CustomerNo',
        title: 'Customer No',
        sortable: true,
        render: (row) => (<Link to={`/${row.id}/settings`}>{customerKey(row)}</Link>)
    },
    {
        id: 1,
        field: 'CustomerName',
        title: 'Customer Name',
        sortable: true,
        render: (row) => (<Link to={`/${row.id}/settings`}>{row.CustomerName}</Link>)
    },
    {id: 3, field: 'CustomerNo', title: 'Orders', render: (row) => <Link to={`/${row.id}/orders`}>Orders</Link>},
    {id: 4, field: 'CustomerNo', title: 'Items', render: (row) => <Link to={`/${row.id}/items`}>Items</Link>},
    {
        id: 2,
        field: 'Notes',
        title: 'Notes/Instructions',
        sortable: true,
        render: (row) => (<div className="d-flex flex-nowrap gap-3">
            <NotesBadge note={row.Notes}/><NotesBadge note={row.SpecialInstructions} bg="warning"/>
        </div>)
    },
];
