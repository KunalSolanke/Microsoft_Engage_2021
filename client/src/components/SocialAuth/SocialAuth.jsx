import React from 'react'
import { GoogleLogin } from "react-google-login";
import GitHubLogin from "react-github-login";
import MicrosoftLogin from "react-microsoft-login";
import config from "../../config/social_auth"
import "./_styles.css"
import {useDispatch} from "react-redux"
import { socialAuth } from "../../store/actions/auth";
function SocialAuth() {
    const dispatch = useDispatch();
    const azureAuthHandler =async (err, data) => {
        //console.log(err, data);
        let token = JSON.stringify({access_token: data?.idToken?.rawIdToken})
        await dispatch(socialAuth(token,"microsoft"))
    };
 

    const onGithubSuccess = async (response) => {
       //console.log(response);
    
       await dispatch(socialAuth(response,"github"))
    }
    const onFailure = (response) => console.error(response);
    const responseGoogle = async (response) => {
        //console.log(response);
        let token = getToken(response)
       await dispatch(socialAuth(token,"google"))
    };

    

    const getToken = (response)=>{
        return JSON.stringify({access_token: response.accessToken}, null,2)
    }

    return (
        <div>
            <p style={{marginBottom:"1rem"}}>Alternate login</p>
                      <div className="social-login" style={{display:"flex",justifyContent:"space-evenly",alignItems:"center",width:"100%"}}>
            <GoogleLogin
              clientId={config.google.clientId}
              render={(renderProps) => (
                <button
                  onClick={renderProps.onClick}
                  disabled={renderProps.disabled}
                  className="button"
                >
                  <img src="https://img.icons8.com/color/48/000000/google-logo.png" className={"socialButton"} />
                </button>
              )}
              buttonText="Login"
              onSuccess={responseGoogle}
              onFailure={onFailure}
              cookiePolicy={config.google.cookiePolicy}
            />
            <GitHubLogin
              clientId={config.github.clientId}
              className="button"
              onSuccess={onGithubSuccess}
              onFailure={onFailure}
              buttonText=""
               redirectUri={config.github.redirectUri}
            >
              <img src="https://img.icons8.com/ios-glyphs/52/000000/github.png" className={"socialButton"}/>
            </GitHubLogin>
            <MicrosoftLogin
              clientId={config.outlook.clientId}
              className="button"
              validateAuthority={config.outlook.validateAuthority}
              redirectUri={config.outlook.redirectUri}
              authCallback={azureAuthHandler}
              tenantUrl={config.outlook.tenantUrl}
            >
              <img src="https://img.icons8.com/color/48/000000/microsoft-outlook-2019--v2.png" className={"socialButton"}/>
            </MicrosoftLogin>
        </div>
        </div>
    )
}

export default SocialAuth
