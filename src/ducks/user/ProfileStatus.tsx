import React, {useEffect, useState} from 'react';
import {useAppDispatch} from "../../app/configureStore";
import {useSelector} from "react-redux";
import {loadUserValidation, selectProfileError, selectProfileLoading, selectProfileValid} from "./index";
import Alert from "@mui/material/Alert";
import LinearProgress from "@mui/material/LinearProgress";
import AlertTitle from "@mui/material/AlertTitle";

const ProfileStatus = () => {
    const dispatch = useAppDispatch();
    const valid = useSelector(selectProfileValid);
    const loading = useSelector(selectProfileLoading);
    const error = useSelector(selectProfileError);
    const [timer, setTimer] = useState(0);



    useEffect(() => {
        dispatch(loadUserValidation());
        const intervalHandle = window.setInterval(() => {
            dispatch(loadUserValidation())
        }, 30 * 60 * 1000);
        setTimer(() => intervalHandle);

        return () => {
            window.clearTimeout(timer);
        }
    }, [])

    return (
        <div className="mt-1">
            {!valid && !loading && <Alert severity="warning">Login is required</Alert>}
            {loading && <LinearProgress variant="indeterminate" />}
            {!!error && <Alert severity="error">
                <AlertTitle>User Validation Error</AlertTitle>
                {error}
            </Alert> }
        </div>
    )
}

export default ProfileStatus;
