import React, { useState,useEffect } from 'react'
import { Button, FormGroup, TextInput} from 'carbon-components-react'
import "./_style.css"
import SocialAuth from '../SocialAuth/SocialAuth'
import {authLogin} from "../../store/actions/auth"
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'

const InvalidPasswordProps = {
    invalid:false,
    invalidText:
        'Your password must be at least 6 characters as well as contain at least one uppercase, one lowercase, and one number.',
    };


function LoginForm() {
    const dispatch = useDispatch();
    const auth = useSelector(state=>state.auth)
    const [userData, setuserData] = useState({email:"",password:""});
    const history = useHistory();
    const handleSubmit=async (e)=>{
        e.preventDefault();
        await dispatch(authLogin(userData));
    }
     useEffect(()=>{
       if(auth.token!=null){
           history.push("/dashboard")
       }
    },[auth]);
    
    return (
        <div>
            <form style={{marginBottom:"1rem"}} onSubmit={(e)=>handleSubmit(e)}>
                <FormGroup legendText="Signin" style={{ maxWidth: '400px' }}>
                    <TextInput
                        id="one"
                        labelText="Email"
                        type="email"
                        required
                        style={{ marginBottom: '1rem' }}
                        onChange={(e)=>setuserData(user=>({...user,email:e.target.value}))}
                    />
                    <TextInput
                        type="password"
                        required
                        id="two"
                        labelText="Password"
                        {...InvalidPasswordProps}
                        onChange={(e)=>setuserData(user=>({...user,password:e.target.value}))}
                    />
                    </FormGroup>
                    <Button kind="primary" type="submit" className="login__button">Login</Button>
                </form>
                <SocialAuth />
            <hr color="#ededed" style={{marginBottom:"1rem",marginTop:"1rem"}}/>
        </div>
    )
}

export default LoginForm
