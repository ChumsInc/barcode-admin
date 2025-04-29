import React from 'react';
import {useAppDispatch, useAppSelector} from "../../app/configureStore";
import {ContextAlert} from '@chumsinc/react-bootstrap-addons'
import {dismissAlert, selectAllAlerts} from "@chumsinc/alert-list";

const AlertList = () => {
    const dispatch = useAppDispatch();
    const list = useAppSelector(selectAllAlerts);

    return (
        <div>
            {list.map(alert => (
                <ContextAlert key={alert.id} context={alert.context} count={alert.count}
                              variant="warning"
                              dismissible onClose={() => dispatch(dismissAlert(alert))}>
                    {alert.message}
                </ContextAlert>
            ))}
        </div>
    )
}
export default AlertList;
