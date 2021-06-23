import React from 'react'
import HomeLayout from '../../layouts/HomeLayout'

import {Grid,Row,Column, Link} from "carbon-components-react";
import LoginForm from '../../components/LoginForm/LoginForm';
import AuthBanner from "../../assets/images/login.jpg"
import "./_style.css"
function LoginPage() {
    return(
        <HomeLayout>
           <Grid fullWidth={true} >
               <Row flexGrow={true} className="auth__grid">
                   <Column md={8} sm={12} lg={12}>
                       <img className="auth__image" src={AuthBanner}/>
                   </Column>
                   <Column md={4} sm={12} lg={4}>
                       <h3>Log In</h3>
                       <div className="redirect">
                           <Link href="#">Don't have an Account ? </Link>
                           <Link href="/accounts/signup">Signup</Link> 
                       </div>
                       <hr color="#ededed" style={{marginTop:"1rem",marginBottom:"2rem"}}/>
                       <LoginForm/>
                        <div className="redirect">
                           <Link href="#">Need help?Contact us here</Link>
                           <Link href="/contact">Support</Link> 
                       </div>
                   </Column>
               </Row>
           </Grid>
        </HomeLayout>
    )
}

export default LoginPage
