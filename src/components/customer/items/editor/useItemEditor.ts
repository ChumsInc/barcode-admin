import {useContext} from "react";
import ItemEditorContext from "@/components/customer/items/editor/ItemEditorContext.tsx";

export const useItemEditor = () => {
    const context = useContext(ItemEditorContext);
    if (!context) {
        throw new Error("useItemEditor must be used within an ItemEditorProvider");
    }
    return context;
};
