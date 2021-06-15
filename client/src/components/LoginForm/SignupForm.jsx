import React ,{useState,useEffect} from 'react'
import { Button, FormGroup, TextInput } from 'carbon-components-react'
import "./_style.css"
import SocialAuth from '../SocialAuth/SocialAuth'
import {authRegister} from "../../store/actions/auth"
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'

const InvalidPasswordProps = {
    invalid:false,
    invalidText:
        'Your password must be at least 6 characters as well as contain at least one uppercase, one lowercase, and one number.',
    };

function SignUpForm() {
     const dispatch = useDispatch();
    const auth = useSelector(state=>state.auth)
    const [userData, setuserData] = useState({email:"",password:"",username:""});
    const history = useHistory();
    const handleSubmit=async (e)=>{
        e.preventDefault();
        await dispatch(authRegister(userData));
    }
    useEffect(()=>{
       if(auth.token!=null){
           history.push("/dashboard")
       }
    },[auth]);
    return (
        <div>
            <form style={{marginBottom:"1rem"}} onSubmit={(e)=>handleSubmit(e)}>
            <FormGroup legendText="Signup" style={{ maxWidth: '25rem' }}>
                <TextInput
                    id="one"
                    labelText="Username"
                    required
                    minLength={6}
                    style={{ marginBottom: '0.5rem' }}
                    onChange={(e)=>setuserData(user=>({...user,username:e.target.value}))}
                />
                <TextInput
                    id="one"
                    labelText="Email"
                    required
                    type="email"
                    style={{ marginBottom: '0.5rem' }}
                    onChange={(e)=>setuserData(user=>({...user,email:e.target.value}))}
                />
                <TextInput
                    type="password"
                    required
                    {...InvalidPasswordProps}
                    id="two"
                    labelText="Password"
                    onChange={(e)=>setuserData(user=>({...user,password:e.target.value}))}
                />
                </FormGroup>
                <Button kind="primary" type="submit" className="login__button">SignUp</Button>
            </form>
            <SocialAuth/>
            <hr color="#ededed" style={{marginBottom:"1rem",marginTop:"1rem"}}/>
        </div>
    )
}

export default SignUpForm
