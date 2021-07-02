import React from 'react'
import HomeLayout from '../../layouts/HomeLayout'

import {Grid,Row,Column} from "carbon-components-react";
import {Link} from "react-router-dom"
import LoginForm from '../../components/LoginForm/LoginForm';
import AuthBanner from "../../assets/images/login.jpg"
import "./_style.css"
function LoginPage() {
    return(
        <HomeLayout>
           <Grid fullWidth={true} >
               <Row flexGrow={true} className="auth__grid">
                   <Column md={8} sm={12} lg={12}>
                       <img className="auth__image" src={AuthBanner} style={{marginLeft:"-2rem"}}/>
                   </Column>
                   <Column md={4} sm={12} lg={4}>
                       <h3>Log In</h3>
                       <div className="redirect">
                           <Link to="#">Don't have an Account ? </Link>
                           <Link to="/accounts/signup">Signup</Link> 
                       </div>
                       <hr color="#ededed" style={{marginTop:"1rem",marginBottom:"2rem"}}/>
                       <LoginForm/>
                        <div className="redirect">
                           <Link to="#">Need help?Contact us here</Link>
                           <Link to="/contact">Support</Link> 
                       </div>
                   </Column>
               </Row>
           </Grid>
        </HomeLayout>
    )
}

export default LoginPage
