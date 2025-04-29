import React, {useEffect} from 'react';
import Alert from "react-bootstrap/Alert";
import {useSelector} from "react-redux";
import {loadVersion, selectVersion} from "./index";
import {useAppDispatch} from "../../app/configureStore";

const VersionAlert = () => {
    const dispatch = useAppDispatch();
    const version = useSelector(selectVersion);
    useEffect(() => {
        dispatch(loadVersion())
    }, []);

    if (!version) {
        return null;
    }
    return (
        <Alert variant="info"><strong className="me-1">Version:</strong>{version}</Alert>
    )
}

export default VersionAlert;
