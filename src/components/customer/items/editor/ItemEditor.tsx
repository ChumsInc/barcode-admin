import {useCallback, useState} from 'react'
import {useAppDispatch, useAppSelector} from "@/app/configureStore.ts";
import type {BarcodeItem} from "chums-types";
import {Col, Form, Row} from "react-bootstrap";
import {SpinnerButton} from "@chumsinc/react-bootstrap-addons";
import Alert from "react-bootstrap/Alert";
import Button from "react-bootstrap/Button";
import {useEditorContext} from "@/hooks/editor/useEditorContext.ts";
import ItemField from "@/components/customer/items/editor/ItemField.tsx";
import {selectItemsStatus} from "@/ducks/customer/customerItemsSlice.ts";
import DescriptionField from "@/components/customer/items/editor/DescriptionField.tsx";
import AlternateItemCodeField from "@/components/customer/items/editor/AlternateItemCodeField.tsx";
import ColorField from "@/components/customer/items/editor/ColorField.tsx";
import CustomerSKUField from "@/components/customer/items/editor/CustomerSKUField.tsx";
import CustomerPartField from "@/components/customer/items/editor/CustomerPartField.tsx";
import MSRPField from "@/components/customer/items/editor/MSRPField.tsx";
import UPCField from "@/components/customer/items/editor/UPCField.tsx";
import StickerTogglesField from "@/components/customer/items/editor/StickerTogglesField.tsx";
import Custom1Field from "@/components/customer/items/editor/Custom1Field.tsx";
import Custom2Field from "@/components/customer/items/editor/Custom2Field.tsx";
import Custom3Field from "@/components/customer/items/editor/Custom3Field.tsx";
import Custom4Field from "@/components/customer/items/editor/Custom4Field.tsx";
import NotesField from "@/components/customer/items/editor/NotesField.tsx";
import SpecialInstructionsField from "@/components/customer/items/editor/SpecialInstructionsField.tsx";
import RemoveItemDialog from "@/components/customer/items/editor/RemoveItemDialog.tsx";
import {useCustomerItems} from "@/components/customer/items/useCustomerItems.ts";
import {newItem} from "@/ducks/customer/utils.ts";
import {removeCustomerItem, saveCustomerItem} from "@/ducks/customer/actions.ts";
import {ErrorBoundary} from "react-error-boundary";
import AppErrorAlert from "@/app/AppErrorAlert.tsx";
import {useItemEditor} from "@/components/customer/items/editor/useItemEditor.ts";

export interface EditableItem extends BarcodeItem {
    changed?: boolean;
}

const ItemEditor = () => {
    const dispatch = useAppDispatch();
    const {customerSettings, setCurrentItem, canEdit} = useCustomerItems();
    const {setSageItem} = useItemEditor();
    const {value, changed} = useEditorContext<BarcodeItem>();
    const status = useAppSelector(selectItemsStatus);
    const [confirmDelete, setConfirmDelete] = useState(false);
    const newItemHandler = useCallback(() => {
        setCurrentItem({...newItem, CustomerID: customerSettings?.id});
        setSageItem(null);
    }, [customerSettings, setCurrentItem, setSageItem])

    const saveHandler = async () => {
        if (!value || !canEdit) {
            return;
        }
        await dispatch(saveCustomerItem(value));
        setCurrentItem({...newItem, CustomerID: customerSettings?.id});
        setSageItem(null);
    }

    const deleteHandler = () => {
        if (!value?.ID) {
            return;
        }
        dispatch(removeCustomerItem(value));
        setConfirmDelete(false);
        setSageItem(null);
        setCurrentItem({...newItem, CustomerID: customerSettings?.id});
    }

    if (!customerSettings) {
        return (
            <h3>Select A Customer</h3>
        )
    }
    return (
        <div>
            <h3>Item Settings</h3>
            <ErrorBoundary FallbackComponent={AppErrorAlert}>
                <Form action={saveHandler}>
                    <ItemField/>
                    <DescriptionField/>
                    <AlternateItemCodeField/>
                    <ColorField/>
                    <CustomerSKUField/>
                    <CustomerPartField/>
                    <MSRPField/>
                    <UPCField/>
                    <StickerTogglesField/>
                    <Custom1Field/>
                    <Custom2Field/>
                    <Custom3Field/>
                    <Custom4Field/>
                    <NotesField/>
                    <SpecialInstructionsField/>
                    <Row className="mt-3 g-3 justify-content-end">
                        <Col xs="auto">
                            <Button type="button" variant="outline-danger" size="sm"
                                    onClick={() => {
                                        setConfirmDelete(true)
                                    }}
                                    disabled={!canEdit || status !== 'idle'}>
                                Delete Item
                            </Button>
                            <RemoveItemDialog item={value} open={confirmDelete} onConfirm={deleteHandler}
                                              onCancel={() => setConfirmDelete(false)}/>
                        </Col>
                        <Col xs="auto">
                            <Button type="button" variant="outline-secondary" size="sm"
                                    onClick={newItemHandler}
                                    disabled={!canEdit || status !== 'idle'}>
                                New Item
                            </Button>
                        </Col>
                        <Col xs="auto">
                            <SpinnerButton type="submit" color="primary" size="sm"
                                           spinning={status === 'loading' || status === 'saving'}
                                           disabled={!canEdit || !value.ItemCode || status !== 'idle'}>
                                Save Item
                            </SpinnerButton>
                        </Col>
                    </Row>
                </Form>
            </ErrorBoundary>
            {changed && (
                <Alert variant="warning mt-1">
                    <span className="bi-exclamation-triangle-fill me-1"/>
                    Don't forget to save!
                </Alert>
            )}
        </div>
    )
}

export default ItemEditor;
