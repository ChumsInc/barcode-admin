import React from 'react';
import {Outlet} from "react-router";
import AppTabs from "./AppTabs";
import AlertList from "../ducks/alerts/AlertList";
import ProfileStatus from "../ducks/user/ProfileStatus";
import VersionAlert from "../ducks/version/VersionAlert";

const AppContent = () => {
    return (
        <div>
            <ProfileStatus />
            <AppTabs/>
            <AlertList/>
            <Outlet/>
            <VersionAlert />
        </div>
    )
}

export default AppContent;
