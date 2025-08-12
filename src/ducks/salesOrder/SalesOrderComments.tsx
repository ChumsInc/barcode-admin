import {useSelector} from "react-redux";
import {selectSalesOrderDetailComments} from "./selectors";
import Alert from "react-bootstrap/Alert";

const SalesOrderComments = () => {
    const comments = useSelector(selectSalesOrderDetailComments);
    if (!comments.length) {
        return null;
    }
    return (
        <Alert variant="info">
            <div><span className="bi-journal-check me-3" /><strong>S/O Comments</strong></div>
            {comments.map(row => (<div key={row.LineKey}><span className="bi-info-circle-fill me-1"/>{row.CommentText}</div>))}
        </Alert>
    )
}

export default SalesOrderComments;
