import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectNotify, selectNotifyDuration, clearNotify } from '../redux/slices/notifySlice';
import { clearError, selectError, selectErrorDuration } from '../redux/slices/errorSlice';
import './Notification.compomnent.scss';

export const NotificationComponent = (): JSX.Element => {
    const notify = useSelector(selectNotify);
    const error = useSelector(selectError);
    const errorDuration = useSelector(selectErrorDuration);
    const notifyDuration = useSelector(selectNotifyDuration);
    const dispatch = useDispatch();
    const [show, setShow] = React.useState(false);
    useEffect(() => {
        if (notify || error) {
            setShow(true);
            setTimeout(() => {
                setShow(false);
            }, error ? errorDuration : notifyDuration);
        }
    },
        [
            notify, error
        ]);

    useEffect(() => {
        if (!show) {
            setTimeout(() => {
                if (notify) {
                    dispatch(clearNotify());
                }
                if (error) {
                    dispatch(clearError());
                }
            }, 1500);
        }
    },
        [
            show
        ]);

    return (
        <>
            <div className={`message_wrap error_message ${show && error && 'show'}`} >{error}</div>
            <div className={`message_wrap  ${show && notify && 'show'}`} >{notify}</div>
        </>
    )
}



