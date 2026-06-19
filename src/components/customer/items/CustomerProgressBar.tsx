import {useSelector} from "react-redux";
import {ProgressBar} from "react-bootstrap";
import {selectCustomerStatus} from "@/ducks/customer/customerSettingsSlice.ts";

export default function CustomerProgressBar() {
    const status = useSelector(selectCustomerStatus);
    return (
        <div style={{minHeight: '10px'}}>
            {status !== 'idle' && (
                <ProgressBar variant="primary" animated now={100}/>
            )}
        </div>
    )
}
