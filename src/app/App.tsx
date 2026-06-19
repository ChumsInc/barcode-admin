import {useEffect} from 'react';
import {HashRouter as Router, Route, Routes} from "react-router";
import {useAppDispatch} from "./configureStore";
import {ErrorBoundary} from "react-error-boundary";
import AppContent from "./AppContent";
import CustomerList from "@/components/customer/list/CustomerList.tsx";
import CustomerSettings from "@/components/customer/editor/CustomerSettingsEditContainer.tsx";
import CustomerOrder from "@/components/customer/order-stickers/CustomerOrder.tsx";
import {loadCustomers} from "../ducks/customers/actions";
import AppErrorAlert from "@/app/AppErrorAlert.tsx";
import CustomerItemsContent from "@/components/customer/items/CustomerItemsContent.tsx";

const App = () => {
    const dispatch = useAppDispatch();

    useEffect(() => {
        dispatch(loadCustomers())
    }, [dispatch]);

    return (
        <ErrorBoundary FallbackComponent={AppErrorAlert}>
            <Router>
                <Routes>
                    <Route path="/" element={<AppContent/>}>
                        <Route index element={<CustomerList/>}/>
                        <Route path="/:id/settings" element={<CustomerSettings/>}/>
                        <Route path="/:id/orders" element={<CustomerOrder/>}/>
                        <Route path="/:id/items" element={<CustomerItemsContent/>}/>
                        <Route path="*" element={<h2>Not Found</h2>}/>
                    </Route>
                </Routes>
            </Router>
        </ErrorBoundary>
    )
}

export default App;
