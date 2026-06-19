import {useAppDispatch, useAppSelector} from "@/app/configureStore.ts";
import type {BarcodeCustomerSettings} from "chums-types";
import {type ReactNode, useCallback, useMemo} from "react";
import {useSelector} from "react-redux";
import {selectCanEdit} from "@/ducks/user";
import {loadCustomer, saveCustomer} from "@/ducks/customer/actions.ts";
import CustomerSettingsContext, {
    type CustomerSettingsContextData
} from "@/components/customer/hooks/CustomerSettingsContext.tsx";
import {useEditorContext} from "@/hooks/editor/useEditorContext.ts";
import {selectCustomers} from "@/ducks/customers";
import {customerKey} from "@/utils/customer.ts";
import {selectCustomerStatus} from "@/ducks/customer/customerSettingsSlice.ts";

export interface CustomerSettingsProviderProps {
    children: ReactNode;
}

export default function CustomerSettingsProvider({children}: CustomerSettingsProviderProps) {
    const dispatch = useAppDispatch();
    const {value} = useEditorContext<BarcodeCustomerSettings>();
    const customers = useAppSelector(selectCustomers);
    const canEdit = useSelector(selectCanEdit);
    const status = useAppSelector(selectCustomerStatus);
    const saveHandler = useCallback((value: BarcodeCustomerSettings) => {
        if (value && canEdit) {
            dispatch(saveCustomer(value));
        }
    }, [dispatch, canEdit]);

    const loadHandler = useCallback((id: number) => {
        if (!id) {
            return;
        }
        dispatch(loadCustomer(id))
    }, [dispatch])

    const contextValue = useMemo<CustomerSettingsContextData>(() => ({
        status,
        customerExists: customers.filter(c => c.id !== value.id).filter(c => customerKey(c) === customerKey(value)).length > 0,
        save: saveHandler,
        load: loadHandler,
    }), [status, saveHandler, loadHandler, customers, value]);

    return (
        <CustomerSettingsContext value={contextValue}>
            {children}
        </CustomerSettingsContext>
    );
}
