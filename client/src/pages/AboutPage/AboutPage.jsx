import React, { useState } from 'react'
import HomeLayout from '../../layouts/HomeLayout'
import { LightboxMediaViewer } from '@carbon/ibmdotcom-react';
import ldImag from "../../assets/images/about_us.jpg"
import { useHistory } from 'react-router-dom';
/**
 * About page component
 * @component
 */
function AboutPage() {
    const [open, setopen] = useState(true)
    const history = useHistory();
    return (
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
            open={open}
            onClose={()=>{
                setopen(false)
                history.push("/")}}
        />
    )
}

export default AboutPage
