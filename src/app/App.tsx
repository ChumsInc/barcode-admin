import {useEffect} from 'react';
import {HashRouter as Router, Route, Routes} from "react-router";
import {useAppDispatch} from "./configureStore";
import {ErrorBoundary} from "react-error-boundary";
import AppContent from "./AppContent";
import CustomerList from "../ducks/customers/CustomerList";
import CustomerSettings from "@/ducks/customer/components/customer-settings/CustomerSettingsEditContainer.tsx";
import CustomerItems from "@/ducks/customer/components/customer-items/CustomerItems.tsx";
import CustomerOrder from "../ducks/customer/CustomerOrder";
import {loadCustomers} from "../ducks/customers/actions";
import AppErrorAlert from "@/app/AppErrorAlert.tsx";

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
                        <Route path="/:id/orders" element={<CustomerOrder/>}/>
                        <Route path="/:id/settings" element={<CustomerSettings/>}/>
                        <Route path="/:id/items" element={<CustomerItems/>}/>
                        <Route path="*" element={<h2>Not Found</h2>}/>
                    </Route>
                </Routes>
            </Router>
        </ErrorBoundary>
    )
}

export default App;
