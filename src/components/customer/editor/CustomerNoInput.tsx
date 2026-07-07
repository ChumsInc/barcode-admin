import {useEditorContext} from "@/hooks/editor/useEditorContext.ts";
import type {BarcodeCustomerSettings} from "chums-types";
import {useId} from "react";
import {CustomerAutocomplete} from "@chumsinc/ui";
import type {SearchCustomer} from "@/src/types.ts";
import {useSelector} from "react-redux";
import {selectCanEdit} from "@/ducks/user";

export default function CustomerNoInput() {
    const {value, updateValue} = useEditorContext<BarcodeCustomerSettings>();
    const canEdit = useSelector(selectCanEdit);
    const id = useId();

    const onSelectHandler = (searchCustomer?: SearchCustomer | null) => {
        console.debug('onSelectHandler()', searchCustomer);
        if (!canEdit) {
            return;
        }
        updateValue({...searchCustomer});
    }

    return (
        <CustomerAutocomplete customer={value} onSelectCustomer={onSelectHandler}
                              slotProps={{
                                  label: 'Customer',
                                  labelProps: {htmlFor: id},
                                  inputProps: {
                                      id: id,
                                      required: true,
                                      autoFocus: true,
                                      name: 'CustomerNo',
                                      minLength: 6,
                                      maxLength: 23,
                                      autoComplete: 'off'
                                  },
                              }}/>
    )
}
