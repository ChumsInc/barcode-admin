import React, {FormEvent, useState} from "react";
import {useAppSelector} from "../../app/configureStore";
import {useNavigate} from "react-router-dom";
import {fetchSOSearch} from "../../api/order-stickers";
import {selectCustomerList} from "./selectors";
import {customerKey} from "../../utils/customer";
import {selectCustomerLoading} from "../customer/selectors";
import {selectSalesOrderLoading} from "../salesOrder/selectors";

const CustomerSearchBySO = () => {
    const navigate = useNavigate();
    const loading = useAppSelector(selectCustomerLoading);
    const soLoading = useAppSelector(selectSalesOrderLoading);
    const customers = useAppSelector(selectCustomerList);
    const [salesOrderNo, setSalesOrderNo] = useState('');
    const [submitted, setSubmitted] = useState<boolean>(false);

    const submitHandler = (ev: FormEvent) => {
        ev.preventDefault();
        const _salesOrderNo = salesOrderNo.padStart(7, '0');
        setSalesOrderNo(_salesOrderNo);
        setSubmitted(true);
        fetchSOSearch(_salesOrderNo)
            .then(so => {
                setSubmitted(false);
                if (!so) {
                    return;
                }
                const customer = customers[customerKey(so)] ?? customers['01-MSRP'];
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
        <form className="input-group input-group-sm" onSubmit={submitHandler}>
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
