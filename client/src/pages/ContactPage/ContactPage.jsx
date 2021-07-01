import React from 'react'
import HomeLayout from '../../layouts/HomeLayout'
import { LightboxMediaViewer } from '@carbon/ibmdotcom-react';
import ldImag from "../../assets/images/c_us.png"
import { useHistory } from 'react-router-dom';
function ContactPage() {
    const history = useHistory();
    return (
        <HomeLayout>
            <LightboxMediaViewer
            title='Contact Us'
            copy='Well at this point me and my laptop are only working members,so yeah,,might as well take up customer support.
            Contact us @facebook'
            media={{
            src:ldImag,
            alt: 'Image alt text',
            title:'Contact Us',
            description:'Well at this point me and my laptop are only working members,so yeah,,might as well take up customer support.\
            Contact us @facebook',
            type: 'image',
            }}
            open={true}
            onClose={()=>history.push("/")}
        />
        </HomeLayout>
    )
}

export default ContactPage
