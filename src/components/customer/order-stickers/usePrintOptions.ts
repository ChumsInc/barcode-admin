import {useContext} from "react";
import PrintOptionsContext from "@/components/customer/order-stickers/PrintOptionsContext.tsx";

export const usePrintOptions = () => {
    const context = useContext(PrintOptionsContext);
    if (!context) {
        throw new Error("usePrintOptions must be used within a PrintOptionsProvider");
    }
    return context;
}
