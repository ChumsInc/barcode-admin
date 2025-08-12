import {useSelector} from "react-redux";
import {selectCurrentCustomer} from "./selectors";
import Alert from "react-bootstrap/Alert"

const CustomerNotes = () => {
    const current = useSelector(selectCurrentCustomer);
    if (!current || !current.Notes) {
        return null
    }
    return (
        <Alert variant="info">
            <strong><span className="bi-card-checklist me-1"/>Customer Notes</strong>
            <div style={{whiteSpace: 'pre-wrap'}}>{current.Notes}</div>
        </Alert>
    )
}

export default CustomerNotes
