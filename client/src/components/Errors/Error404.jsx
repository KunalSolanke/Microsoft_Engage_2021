import React from 'react'
import {HTTPError404 } from "@carbon/ibm-cloud-cognitive"
function Error404() {
    return (
        <HTTPError404
            description="The page you are looking for was not found."
            errorCodeLabel="Error 404"
            links={[
                {
                href: '/',
                text: 'Connect'
                },
                {
                href: '/support',
                text: 'Try to reach our support for more info'
                }
            ]}
            title="Page not found"
/>
    )
}

export default Error404
