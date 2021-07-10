import React, { useState } from 'react'
import { LightboxMediaViewer } from '@carbon/ibmdotcom-react';
import ldImag from "../../assets/images/c_us.png"
import { useHistory } from 'react-router-dom';
/**
 * Contact page component
 * @component
 */
function ContactPage() {
    const [open, setopen] = useState(true)
    const history = useHistory()
    return (
            <LightboxMediaViewer
            title='Contact Us'
            copy='Well at this point me and my laptop are only working members,so yeah might as well take up customer support.
            Contact us @facebook'
            media={{
            src:ldImag,
            alt: 'Image alt text',
            title:'Contact Us',
            description:'Well at this point me and my laptop are only working members,so yeah,,might as well take up customer support.\
            Contact us @facebook',
            type: 'image',
            }}
            open={open}
            onClose={()=>{
                setopen(false)
                history.push("/")
}}
        />
    )
}

export default ContactPage
