import React from 'react'
import HomeLayout from '../../layouts/HomeLayout'
import {Grid,Row,Column} from "carbon-components-react";
import {Link} from "react-router-dom"
import SignUpForm from '../../components/LoginForm/SignupForm';
import AuthBanner from "../../assets/images/login.jpg"
import "./_style.css"
/**
 *Login page component
 * @component
 */
function SignUpPage() {
    return(
        <HomeLayout>
           <Grid fullWidth={true} >
               <Row flexGrow={true} className="auth__grid">
                   <Column md={4} sm={12} lg={4}>
                       <h3>Sign up</h3>
                       <div className="redirect">
                           <Link to="/accounts/login">Already have an Account ? </Link>
                           <Link to="/accounts/login">Login</Link> 
                       </div>
                       <hr color="#ededed" style={{marginTop:"1rem",marginBottom:"1rem"}}/>
                       <SignUpForm/>
                        <div className="redirect">
                           <Link to="/contact">Need help?Contact us here</Link>
                           <Link to="/contact">Support</Link> 
                       </div>
                   </Column>
                   <Column md={4} sm={12} lg={12}>
                       <img className="auth__image signup" src={AuthBanner}/>
                   </Column>
                   
               </Row>
           </Grid>
        </HomeLayout>
    )
}

export default SignUpPage
