import SalesOrderControlBar from "@/components/customer/order-stickers/SalesOrderControlBar.tsx";
import SalesOrderDetailTable from "@/components/customer/order-stickers/SalesOrderDetailTable.tsx";
import {useSelector} from "react-redux";
import CustomerInfo from "@/components/customer/common/CustomerInfo.tsx";
import {selectCustomerSettings} from "@/ducks/customer/customerSettingsSlice.ts";
import SalesOrderProvider from "@/components/customer/order-stickers/SalesOrderProvider.tsx";
import OrderStickersProvider from "@/components/customer/order-stickers/OrderStickersProvider.tsx";
import SalesOrderStatus from "@/components/customer/order-stickers/SalesOrderStatus.tsx";
import PrintOptionsProvider from "@/components/customer/order-stickers/PrintOptionsProvider.tsx";

const CustomerOrder = () => {
    const customer = useSelector(selectCustomerSettings);
    return (
        <SalesOrderProvider>
            <CustomerInfo/>
            {customer?.active && (
                <PrintOptionsProvider>
                    <OrderStickersProvider>
                        <SalesOrderControlBar/>
                        <SalesOrderStatus/>

                        <SalesOrderDetailTable/>

                    </OrderStickersProvider>
                </PrintOptionsProvider>
            )}
        </SalesOrderProvider>
    )
}
export default CustomerOrder;

