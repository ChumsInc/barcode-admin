import {Outlet} from "react-router";
import AppTabs from "./AppTabs";
import AlertList from "../ducks/alerts/AlertList";
import ProfileStatus from "../ducks/user/ProfileStatus";
import styled from "@emotion/styled";
import {AppVersion} from "@chumsinc/ui";



const AppDiv = styled.div`
    .bg-warning {
        color: var(--bs-dark-text-emphasis);
    }
`
const AppContent = () => {
    return (
        <AppDiv>
            <ProfileStatus/>
            <AppTabs/>
            <AlertList/>
            <Outlet/>
            <div className="d-flex justify-content-center mt-5">
                <AppVersion/>
            </div>
        </AppDiv>
    )
}

export default AppContent;
