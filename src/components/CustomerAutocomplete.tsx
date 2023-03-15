import React, {ChangeEvent, HTMLAttributes, useEffect, useId, useRef, useState} from 'react';
import {SearchCustomer} from "../types";
import {fetchCustomerLookup} from "../api/customer";
import {customerKey} from "../utils/customer";
import AutoComplete from "./AutoComplete";

const BarcodeCustomerAutocomplete = AutoComplete<SearchCustomer>;

export interface CustomerAutocompleteProps extends HTMLAttributes<HTMLInputElement> {
    customer: SearchCustomer;
    onChange?: (ev: ChangeEvent<HTMLInputElement>) => void;
    onSelectCustomer: (customer?: SearchCustomer) => void;
    children?: React.ReactNode;
}

const CustomerAutocomplete = ({
                                  customer,
                                  onChange,
                                  onSelectCustomer,
                                  children,
                                  ...props
                              }: CustomerAutocompleteProps) => {
    const [value, setValue] = useState(customerKey(customer));
    const [results, setResults] = useState<SearchCustomer[]>([]);
    const [loading, setLoading] = useState(false);
    const [tHandle, setTHandle] = useState(0);
    const containerRef = useRef<HTMLDivElement>(null);
    const id = useId();

    useEffect(() => {
        setValue(customerKey(customer));
        loadCustomerSearch(customerKey(customer));
    }, [customer.ARDivisionNo, customer.CustomerNo, customer.CustomerName, customer.Company]);

    useEffect(() => {
        return () => {
            window.clearTimeout(tHandle);
        }
    }, [])

    useEffect(() => {
        if (value.length < 2) {
            return;
        }
        window.clearTimeout(tHandle);
        const t = window.setTimeout(() => loadCustomerSearch(value), 350);
        setTHandle(t);
    }, [value]);

    const loadCustomerSearch = (value: string) => {
        if (loading) {
            return;
        }
        setLoading(true);
        fetchCustomerLookup(value)
            .then(results => {
                setResults(results);
                setLoading(false);
                const [customer] = results.filter(customer => customerKey(customer) === value);
                onSelectCustomer(customer);
            })
            .catch((err: unknown) => {
                setLoading(false);
                if (err instanceof Error) {
                    console.log(err.message);
                }
            });
    }

    const changeHandler = (ev: ChangeEvent<HTMLInputElement>) => {
        setValue(ev.target.value);
        if (onChange) {
            onChange(ev);
        }
    }
    const recordChangeHandler = (customer?: SearchCustomer) => {
        if (customer) {
            setValue(customerKey(customer))
        }
    }

    const customerFilter = (value: string) => (row: SearchCustomer) => {
        console.log(row);
        return !row
            || customerKey(row).toLowerCase().startsWith(value.toLowerCase())
            || row.CustomerName?.toLowerCase().includes(value.toLowerCase());
    }

    const renderItem = (row: SearchCustomer) => {
        return (
            <div><strong className="me-3">{customerKey(row)}</strong>{row.CustomerName}</div>
        )
    }

    return (
        <div className="input-group input-group-sm" ref={containerRef}>
            <span className="input-group-text">
                <span className="bi-search"/>
            </span>
            <BarcodeCustomerAutocomplete containerRef={containerRef} {...props}
                                          value={value} data={results} onChange={changeHandler}
                                          onChangeRecord={recordChangeHandler}
                                          renderItem={renderItem}
                                          itemKey={row => customerKey(row)} filter={customerFilter}/>
            {children}
        </div>
    )

}
export default CustomerAutocomplete
