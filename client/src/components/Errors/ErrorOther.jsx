import { ErrorEmptyState } from '@carbon/ibm-cloud-cognitive/lib/components'
import React from 'react'


/**
 * Catch all the other errors inside error boundry
 * @component
 */
function ErrorOther() {
    return (
        <div>
            <ErrorEmptyState
            subtitle="Try logout and signup or refreshing your browser"
            title="Something went wrong"
             link={{
                href: '/contact',
                text: 'Report issue'
            }}
                        />
        </div>
    )
}

export default ErrorOther
