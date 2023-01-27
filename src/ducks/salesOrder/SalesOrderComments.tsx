import React from 'react';
import {useSelector} from "react-redux";
import {selectSalesOrderDetailComments} from "./selectors";
import {Alert} from "chums-components";

const SalesOrderComments = () => {
    const comments = useSelector(selectSalesOrderDetailComments);
    if (!comments.length) {
        return null;
    }
    return (
        <Alert color="info">
            <div><span className="bi-journal-check me-3" /><strong>S/O Comments</strong></div>
            {comments.map(row => (<div><span className="bi-info-circle-fill me-1"/>{row.CommentText}</div>))}
        </Alert>
    )
}

export default SalesOrderComments;
