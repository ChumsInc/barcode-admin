import React from 'react';
import {useSelector} from "react-redux";
import {selectMissingItems} from "./selectors";
import Alert from "react-bootstrap/Alert";

const MissingItemAlert = () => {
    const missing = useSelector(selectMissingItems);
    if (!missing) {
        return null;
    }
    return (
        <Alert variant="warning">
            <span className="bi-exclamation-triangle-fill me-1" />
            Missing data for <strong>{missing}</strong> item{missing === 1 ? '' : 's'}.
        </Alert>
    )
}

export default MissingItemAlert;
