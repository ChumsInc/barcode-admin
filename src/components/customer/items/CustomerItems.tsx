import CustomerItemList from "@/components/customer/items/list/CustomerItemList.tsx";
import ItemEditor from "@/components/customer/items/editor/ItemEditor.tsx";
import CustomerItemFilter from "@/components/customer/items/list/CustomerItemFilter.tsx";
import CustomerItemFilterInactive from "@/components/customer/items/list/CustomerItemFilterInactive.tsx";
import {useSelector} from "react-redux";
import ReloadCustomerButton from "@/components/customer/ReloadCustomerButton.tsx";
import CustomerInfo from "@/components/customer/common/CustomerInfo.tsx";
import CustomerProgressBar from "@/components/customer/items/CustomerProgressBar.tsx";
import {useTableFields, useTableSort} from "@chumsinc/sortable-tables";
import {getCustomerColumns} from "@/components/customer/items/list/CustomerItemListFields.tsx";
import {selectCustomerSettings} from "@/ducks/customer/customerSettingsSlice.ts";
import {startTransition, useEffect} from "react";
import type {BarcodeItem} from "chums-types";
import {setCustomerItemsSort} from "@/ducks/customer/customerItemsSlice.ts";
import {useAppDispatch} from "@/app/configureStore.ts";
import EditorProvider from "@/hooks/editor/EditorProvider.tsx";
import {useCustomerItems} from "@/components/customer/items/useCustomerItems.ts";
import ItemEditorProvider from "@/components/customer/items/editor/ItemEditorProvider.tsx";

const CustomerItems = () => {
    const dispatch = useAppDispatch();
    const customer = useSelector(selectCustomerSettings);
    const [, setFields] = useTableFields<BarcodeItem>();
    const [currentSort] = useTableSort<BarcodeItem>();
    const {currentItem} = useCustomerItems();

    useEffect(() => {
        if (currentSort) {
            dispatch(setCustomerItemsSort(currentSort))
        }
    }, [currentSort, dispatch]);

    useEffect(() => {
        startTransition(() => {
            setFields(getCustomerColumns(customer));
        })
    }, [customer, setFields]);

    return (
        <div>
            <CustomerInfo/>
            <div className="row g-3 mt-1">
                <div className="col-auto">
                    <CustomerItemFilter/>
                </div>
                <div className="col-auto">
                    <CustomerItemFilterInactive/>
                </div>
                <div className="col-auto">
                    <ReloadCustomerButton/>
                </div>
                {customer?.active && (
                    <div className="col-auto">
                        <a href={`/api/operations/barcodes/customers/${customer.id}/items.xlsx`}
                           className="btn btn-sm btn-outline-secondary" target="_blank" rel="noreferrer noopener">
                            Download Item List
                        </a>
                    </div>
                )}
            </div>
            <CustomerProgressBar/>
            {customer?.active && (
                <div className="row g-3">
                    <div className="col-6 col-md-7 col-lg-8 col-xl-9">
                        <CustomerItemList/>
                    </div>
                    <div className="col-6 col-md-5 col-lg-4 col-xl-3">
                        <EditorProvider initialValue={currentItem}>
                            <ItemEditorProvider>
                                <ItemEditor/>
                            </ItemEditorProvider>
                        </EditorProvider>
                    </div>
                </div>
            )}
        </div>
    )
}
export default CustomerItems;

