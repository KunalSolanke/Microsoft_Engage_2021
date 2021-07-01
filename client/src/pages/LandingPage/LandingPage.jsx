import React from 'react'
import HomeLayout from '../../layouts/HomeLayout/HomeLayout'
import {LeadSpace,FeatureCard,CalloutWithMedia,Footer} from "@carbon/ibmdotcom-react"
import { ArrowRight16, ArrowRight20 } from '@carbon/icons-react'
import leadspaceImg1 from "../../assets/images/video_chat.webp"
import "./_styles.css"
import connectImg from "../../assets/images/connect.png"
import connectAltImg from "../../assets/images/connect_al.jpg"
import vLiveImg from "../../assets/images/vlive.png"

const mediaData = {
    heading: 'Connecting with your peers,one click away',
    image: {
      sources: [
        {
          src:
            vLiveImg,
          breakpoint: 320,
        },
        {
          src:
            vLiveImg,
          breakpoint: 400,
        },
        {
          src:
            vLiveImg,
          breakpoint: 672,
        },
      ],
      alt: 'Image alt text',
      defaultSrc:
        vLiveImg,
    },
  };
const card={
         eyebrow:"Connect",
          heading:"Explore how connect works. ",
          copy:"Connect with us and actively engage with your friends anytime",
          image: {
            defaultSrc: connectImg,
            alt: 'Image alt text',
          },
          cta: {
            href: "/accounts/login",
            icon: {
              src: ArrowRight20,
            },
          },
        }
const navigation={
  footerThin: [{
      title: "Contact",
      url: "/contact"
    },{
      title: "About",
      url: "/about"
    }]
}
function LandingPage() {
    const items = [
  { id: 'da', text: 'Danish / Dansk' },
  { id: 'nl', text: 'Dutch / Nederlands' },
  { id: 'en', text: 'English' },
];



function myLanguageCallback(selectedItem) {
  console.log(selectedItem); // { "id": "en", "text": "English" }
}
    const buttons=[{
        copy:"Join Now",
        renderIcon:ArrowRight16,
        href:"/accounts/login"
    }]
    return (
        <HomeLayout>
            <LeadSpace
                theme="light"
                title={"Connect"}
                copy={"Connect with us and actively engage with your friends anytime"}
                gradient={true}
                buttons={buttons}
                image={{
                    sources: [
                    {
                        src:  "https://s35691.pcdn.co/wp-content/uploads/2020/09/Building-Relationships-How-to-Connect-from-a-Distance.jpg",
                        breakpoint: 'sm',
                    },
                    {
                        src:connectAltImg,
                        breakpoint: 'md',
                    },
                    ],
                    defaultSrc: leadspaceImg1,
                    alt: 'lead space image',
                }}
                size="tall"
            />
            <div className="bx--grid">
                <div className="bx--row">
                    <div
                    style={{ paddingTop: '20px' }}
                    className="bx--col-sm-4 bx--col-lg-12 bx--offset-lg-2">
                    <FeatureCard card={card} size={'medium'} />
                    </div>
                </div>
            </div>
            <div className="bx--grid full_width">
        <div className="bx--row ">
            <div className="bx--offset-lg-4 bx--col-lg-12">
            <CalloutWithMedia
                mediaData={mediaData}
                mediaType={"image"}
                heading={"At connect we aim to join as many people as possible"}
                copy={"Join us and expand your network with live features @Connect"}
            />
            </div>
        </div>
        </div>
         <div style={{ display: 'flex', alignItems: 'center', height: '100%' }}>
                <Footer
                navigation={navigation}
                type={"micro"}
                languageOnly={true}
      languageItems={items}
      languageInitialItem={items[2]}
      languageCallback={myLanguageCallback}
                />
    </div>
        </HomeLayout>
    )
}

export default LandingPage
