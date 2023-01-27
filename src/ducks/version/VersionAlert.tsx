import React, {useEffect} from 'react';
import {Alert} from "chums-components";
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
        <Alert color="light"><strong className="me-1">Version:</strong>{version}</Alert>
    )
}

export default VersionAlert;
