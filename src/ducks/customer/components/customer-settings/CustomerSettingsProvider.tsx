import {useAppDispatch, useAppSelector} from "@/app/configureStore.ts";
import type {BarcodeCustomerSettings} from "chums-types";
import {selectCustomerStatus} from "@/ducks/customer/selectors.ts";
import {type ReactNode, useCallback, useMemo} from "react";
import {useSelector} from "react-redux";
import {selectCanEdit} from "@/ducks/user";
import {loadCustomer, saveCustomer} from "@/ducks/customer/actions.ts";
import CustomerSettingsContext, {
    type CustomerSettingsContextData
} from "@/ducks/customer/components/customer-settings/CustomerSettingsContext.tsx";
import {useEditorContext} from "@/hooks/editor/useEditorContext.ts";
import {selectCustomers} from "@/ducks/customers/index.ts";
import {customerKey} from "@/utils/customer.ts";

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
