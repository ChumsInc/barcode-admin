import {useSalesOrder} from "@/components/customer/order-stickers/useSalesOrder.ts";

export default function SalesOrderStatus() {
    const {isPending, salesOrderNo, error} = useSalesOrder();
    return (
        <div className="row g-3">
            <div className="col-auto">
                Sales Order: {salesOrderNo}
            </div>
            <div className="col-auto">
                {isPending && <span className="spinner-border spinner-border-sm"/>}
                {error && <span className="text-danger">{error}</span>}
            </div>
        </div>
    )
}
