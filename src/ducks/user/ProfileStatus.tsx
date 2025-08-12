import {useEffect, useState} from 'react';
import {useAppDispatch} from "@/app/configureStore";
import {useSelector} from "react-redux";
import {loadUserValidation, selectProfileError, selectProfileLoading, selectProfileValid} from "./index";
import Alert from "react-bootstrap/Alert";

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
            {!valid && !loading && <Alert variant="warning">Login is required</Alert>}
            {!!error && <Alert variant="danger">
                <div><strong>User Validation Error</strong></div>
                {error}
            </Alert> }
        </div>
    )
}

export default ProfileStatus;
