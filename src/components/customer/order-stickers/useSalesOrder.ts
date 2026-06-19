import {useContext} from "react";
import SalesOrderContext from "@/components/customer/order-stickers/SalesOrderContext.tsx";

export const useSalesOrder = () => {
    const context = useContext(SalesOrderContext);
    if (!context) {
        throw new Error("useSalesOrder must be used within a SalesOrderProvider");
    }
    return context;
};
