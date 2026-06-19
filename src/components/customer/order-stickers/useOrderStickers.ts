import {useContext} from "react";
import OrderStickersContext from "@/components/customer/order-stickers/OrderStickersContext.tsx";

export const useOrderStickers = () => {
    const context = useContext(OrderStickersContext);
    if (!context) {
        throw new Error("useOrderStickers must be used within a OrderStickersProvider");
    }
    return context;
};
