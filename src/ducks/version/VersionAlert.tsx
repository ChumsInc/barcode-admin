import React, {useEffect} from 'react';
import Alert from "react-bootstrap/Alert";
import {useSelector} from "react-redux";
import {loadVersion, selectVersion} from "./index";
import {useAppDispatch} from "../../app/configureStore";
import {Container} from "react-bootstrap";

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
        <Container>
            <Alert variant="info" className="mt-5"><strong className="me-1">Version:</strong>{version}</Alert>
        </Container>

    )
}

export default VersionAlert;
