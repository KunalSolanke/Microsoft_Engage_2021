import React from 'react'
import HomeLayout from '../../layouts/HomeLayout'
import { LightboxMediaViewer } from '@carbon/ibmdotcom-react';
import ldImag from "../../assets/images/about_us.jpg"
import { useHistory } from 'react-router-dom';
function AboutPage() {
    const history = useHistory();
    return (
        <HomeLayout>
            <LightboxMediaViewer
            title='About Us'
            copy='Connect is a platform meant to serve people by connecting them with their friends and family with single swipe.We\
            want to make sure everyone is reached and connected'
            media={{
            src:ldImag,
            alt: 'Image alt text',
            title: "About Us",
            description:"Connect is a platform meant to serve people by connecting them with their friends and family with single swipe.We\
            want to make sure everyone is reached and connected",
            type: 'image',
            }}
            open={true}
            onClose={()=>history.push("/")}
        />
        </HomeLayout>
    )
}

export default AboutPage
