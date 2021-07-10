import React ,{useState,useEffect} from 'react'
import { Button, FormGroup, InlineLoading, TextInput } from 'carbon-components-react'
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
/**
 * Sign form component handles sign form submit
 * @component
 * 
 */
function SignUpForm() {
     const [isSubmitting, setIsSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);
    const [description, setDescription] = useState('Signing up...');
    const [ariaLive, setAriaLive] = useState('off');
     const dispatch = useDispatch();
    const auth = useSelector(state=>state.auth)
    const [userData, setuserData] = useState({email:"",password:"",username:""});
    const history = useHistory();
    /**
     * Set and unset local loading based on the status of login
     */
    const handleSubmit=async (e)=>{
        setAriaLive('asserative');
        setIsSubmitting(true)
            e.preventDefault();
        await dispatch(authRegister(userData));
         setIsSubmitting(false);
        setSuccess(true);
        setDescription('Submitted!');
        setAriaLive('off');
        setTimeout(() => {
            setSuccess(false);
            setDescription('Signup up...');
            setAriaLive('off');
            }, 1000);
    }
    /**
     * Redirect user if he is already logged in 
     */
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
                {isSubmitting || success ? ( <InlineLoading
              style={{ marginLeft: '1rem' }}
              description={description}
              status={success ? 'finished' : 'active'}
              aria-live={ariaLive}
            />
          ) : (
            <Button kind="primary" type="submit" className="login__button">SignUp</Button>
          )}
                
            </form>
            <SocialAuth/>
            <hr color="#ededed" style={{marginBottom:"1rem",marginTop:"1rem"}}/>
        </div>
    )
}

export default SignUpForm
