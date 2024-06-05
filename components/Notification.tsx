import React from 'react';
import { XCircleIcon, CheckCircleIcon, ExclamationTriangleIcon, InformationCircleIcon } from '@heroicons/react/20/solid'

export enum NOTIFICATION_TYPE { success, warning, error, info }

interface NotificationProps {
    type: NOTIFICATION_TYPE
    message: string
}

export const Notification: React.FC<NotificationProps> = ({ type, message }) => {
    return (
        <>
            {(() => {
                switch (type) {
                    case NOTIFICATION_TYPE.error:
                        return (
                            <div className='rounded-md bg-red-50 p-4 opacity-0 animate-in'>
                                <div className="flex justify-center">
                                    <div className="flex-shrink-0">
                                        <XCircleIcon className="h-5 w-5 text-red-400" aria-hidden="true" />
                                    </div>
                                    <div className="ml-3">
                                        <h3 className="text-sm font-medium text-red-800">{message}</h3>
                                    </div>
                                </div>
                            </div >
                        )
                    case NOTIFICATION_TYPE.success:
                        return (
                            <div className="toast rounded-md bg-green-50 p-4 animate-in opacity-0">
                                <div className="flex">
                                    <div className="flex-shrink-0">
                                        <CheckCircleIcon className="h-5 w-5 text-green-400" aria-hidden="true" />
                                    </div>
                                    <div className="ml-3">
                                        <h3 className="text-sm font-medium text-green-800">{message}</h3>
                                    </div>
                                </div>
                            </div>
                        )
                    case NOTIFICATION_TYPE.warning:
                        return (
                            <div className="toast rounded-md bg-yellow-50 p-4 animate-in opacity-0">
                                <div className="flex">
                                    <div className="flex-shrink-0">
                                        <ExclamationTriangleIcon className="h-5 w-5 text-yellow-400" aria-hidden="true" />
                                    </div>
                                    <div className="ml-3">
                                        <h3 className="text-sm font-medium text-yellow-800">{message}</h3>
                                    </div>
                                </div>
                            </div>
                        )
                    case NOTIFICATION_TYPE.info:
                        return (
                            <div className="toast rounded-md bg-blue-50 p-4 animate-in opacity-0">
                                <div className="flex">
                                    <div className="flex-shrink-0">
                                        <InformationCircleIcon className="h-5 w-5 text-blue-400" aria-hidden="true" />
                                    </div>
                                    <div className="ml-3">
                                        <h3 className="text-sm font-medium text-blue-800">{message}</h3>
                                    </div>
                                </div>
                            </div>
                        )
                    default:
                        return null
                }
            })()}
        </>
    );
};