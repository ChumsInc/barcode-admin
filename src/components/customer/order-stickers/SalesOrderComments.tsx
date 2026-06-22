import Alert from "react-bootstrap/Alert";
import {useSalesOrder} from "@/components/customer/order-stickers/useSalesOrder.ts";

const SalesOrderComments = () => {
    const {orderDetail} = useSalesOrder();
    const comments = orderDetail.filter(row => row.ItemType === '4' && row.CommentText);
    if (!comments.length) {
        return null;
    }
    return (
        <Alert variant="info">
            <div><span className="bi-journal-check me-3"/><strong>S/O Comments</strong></div>
            {comments.map(row => (
                <div key={row.LineKey}><span className="bi-info-circle-fill me-1"/>{row.CommentText}</div>))}
        </Alert>
    )
}

export default SalesOrderComments;
