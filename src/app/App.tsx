import React, {useEffect} from 'react';
import {HashRouter as Router, Route, Routes} from "react-router";
import {useAppDispatch} from "./configureStore";
import ErrorBoundary from "../components/ErrorBoundary";
import AppContent from "./AppContent";
import CustomerList from "../ducks/customers/CustomerList";
import CustomerSettings from "../ducks/customer/CustomerSettings";
import CustomerItems from "../ducks/customer/CustomerItems";
import CustomerOrder from "../ducks/customer/CustomerOrder";
import {loadCustomers} from "../ducks/customers/actions";
import {createTheme, ThemeProvider} from '@mui/material/styles';
import CssBaseline from "@mui/material/CssBaseline";
import useMediaQuery from "@mui/material/useMediaQuery";

const App = () => {
    const dispatch = useAppDispatch();
    const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');

    useEffect(() => {
        dispatch(loadCustomers())
    }, []);

    const theme = React.useMemo(
        () =>
            createTheme({
                palette: {
                    mode: prefersDarkMode ? 'dark' : 'light',
                },
            }),
        [prefersDarkMode],
    );


    return (
        <ErrorBoundary>
            <ThemeProvider theme={theme}>
                <CssBaseline/>
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
            </ThemeProvider>
        </ErrorBoundary>
    )
}

export default App;
