import {useAppDispatch} from "@/app/configureStore.ts";
import {useSelector} from "react-redux";
import type {BarcodeItem, SortProps} from "chums-types";
import {ContainedVirtualTable} from "@chumsinc/sortable-tables";
import classNames from "classnames";
import CustomerItemListContainer from "@/components/customer/items/list/CustomerItemListContainer.tsx";
import {useCustomerItems} from "@/components/customer/items/useCustomerItems.ts";
import {selectFilteredItems, setCustomerItemsSort} from "@/ducks/customer/customerItemsSlice.ts";
import {useCallback} from "react";


const CustomerItemList = () => {
    const dispatch = useAppDispatch();
    const {setCurrentItem, currentItem} = useCustomerItems();
    const filteredItems = useSelector(selectFilteredItems);
    const sortChangeHandler = useCallback((sort: SortProps<BarcodeItem>) => {
        dispatch(setCustomerItemsSort(sort));
    }, [dispatch])

    const selectHandler = (item: BarcodeItem) => {
        setCurrentItem(item);
    }

    const rowClassName = (row: BarcodeItem) => {
        return classNames({
            'text-danger': row.InactiveItem === 'Y' || row.ProductType === 'D',
            'text-warning': row.InactiveItem === null,
        })
    }

    return (
        <CustomerItemListContainer>
            <ContainedVirtualTable data={filteredItems} keyField={'ID'}
                                   className="bca--customer-item-list"
                                   onChangeSort={sortChangeHandler}
                                   onSelectRow={selectHandler} rowClassName={rowClassName}
                                   selected={(row: BarcodeItem) => row.ID === currentItem?.ID}/>
        </CustomerItemListContainer>
    )

}

export default CustomerItemList;
