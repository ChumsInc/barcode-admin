import {Outlet} from "react-router";
import AppTabs from "./AppTabs";
import AlertList from "../ducks/alerts/AlertList";
import ProfileStatus from "../ducks/user/ProfileStatus";
import VersionAlert from "../ducks/version/VersionAlert";
import styled from "@emotion/styled";


const AppDiv = styled.div`
    .bg-warning {
        color: var(--bs-dark-text-emphasis);
    }
`
const AppContent = () => {
    return (
        <AppDiv>
            <ProfileStatus />
            <AppTabs/>
            <AlertList/>
            <Outlet/>
            <VersionAlert />
        </AppDiv>
    )
}

export default AppContent;
