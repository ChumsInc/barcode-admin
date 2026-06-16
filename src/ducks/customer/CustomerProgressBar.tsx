import {useSelector} from "react-redux";
import {selectCustomerLoading, selectCustomerSaving} from "./selectors";
import {ProgressBar} from "react-bootstrap";

export default function CustomerProgressBar() {
    const loading = useSelector(selectCustomerLoading);
    const saving = useSelector(selectCustomerSaving);
    return (
        <div style={{minHeight: '10px'}}>
            {loading || saving && (
                <ProgressBar variant="primary" animated now={100}/>
            )}
        </div>
    )
}
