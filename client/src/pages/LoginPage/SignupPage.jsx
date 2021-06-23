import React from 'react'
import HomeLayout from '../../layouts/HomeLayout'
import {Grid,Row,Column,Link} from "carbon-components-react";
import SignUpForm from '../../components/LoginForm/SignupForm';
import AuthBanner from "../../assets/images/login.jpg"
import "./_style.css"
function SignUpPage() {
    return(
        <HomeLayout>
           <Grid fullWidth={true} >
               <Row flexGrow={true} className="auth__grid">
                   <Column md={4} sm={12} lg={4}>
                       <h3>Sign up</h3>
                       <div className="redirect">
                           <Link href="#">Already have an Account ? </Link>
                           <Link href="/accounts/login">Login</Link> 
                       </div>
                       <hr color="#ededed" style={{marginTop:"1rem",marginBottom:"1rem"}}/>
                       <SignUpForm/>
                        <div className="redirect">
                           <Link href="#">Need help?Contact us here</Link>
                           <Link href="/contact">Support</Link> 
                       </div>
                   </Column>
                   <Column md={8} sm={12} lg={12}>
                       <img className="auth__image" src={AuthBanner}/>
                   </Column>
                   
               </Row>
           </Grid>
        </HomeLayout>
    )
}

export default SignUpPage
