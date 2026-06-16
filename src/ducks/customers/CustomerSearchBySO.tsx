import {useState} from "react";
import {useAppSelector} from "@/app/configureStore";
import {useNavigate} from "react-router";
import {fetchSOSearch} from "@/api/order-stickers";
import {customerKey} from "@/utils/customer";
import {selectCustomerLoading} from "../customer/selectors";
import {selectSalesOrderLoading} from "../salesOrder/selectors";
import {selectCustomers} from "@/ducks/customers/index.ts";

const CustomerSearchBySO = () => {
    const navigate = useNavigate();
    const loading = useAppSelector(selectCustomerLoading);
    const soLoading = useAppSelector(selectSalesOrderLoading);
    const customers = useAppSelector(selectCustomers);
    const [salesOrderNo, setSalesOrderNo] = useState('');
    const [submitted, setSubmitted] = useState<boolean>(false);

    const submitHandler = () => {
        const _salesOrderNo = salesOrderNo.padStart(7, '0');
        setSalesOrderNo(_salesOrderNo);
        setSubmitted(true);
        fetchSOSearch(_salesOrderNo)
            .then(so => {
                setSubmitted(false);
                if (!so) {
                    return;
                }
                const customer = customers.find(c => customerKey(c) === customerKey(so))
                    ?? customers.find(c => customerKey(c) === '01-MSRP');
                if (!customer) {
                    return;
                }
                navigate(`/${customer.id}/orders/?salesOrderNo=${so.SalesOrderNo}`);
            })
            .catch((err: unknown) => {
                setSubmitted(false);
                if (err instanceof Error) {
                    console.log(err.message);
                }
            })
    }

    return (
        <form className="input-group input-group-sm" action={submitHandler}>
            <div className="input-group-text">SO#</div>
            <input type="search" className="form-control form-control-sm" value={salesOrderNo}
                   required maxLength={7}
                   onChange={(ev) => setSalesOrderNo(ev.target.value)} placeholder="Search by SO#"/>
            <button type="submit" className="btn btn-sm btn-outline-primary"
                    disabled={soLoading || loading || submitted}>Load
            </button>
        </form>
    )
}

export default CustomerSearchBySO;
