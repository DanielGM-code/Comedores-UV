import { Alert } from '@mui/material'
import React from 'react'

const MessageAlert = ({ typeAlert, validation }) => {

    return (
        <>
            {validation && <Alert severity={typeAlert}>{validation}</Alert>}
        </>
    )
}

export default MessageAlert