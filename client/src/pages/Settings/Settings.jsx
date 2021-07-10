import { Button, Content, FileUploader, FormGroup, InlineLoading, TextArea, TextInput } from 'carbon-components-react'
import React, { useEffect, useState } from 'react'
import DashboardLayout from '../../layouts/DashboardLayout/DashboardLayout'
import { settings } from 'carbon-components';
import "./_styles.css"
import { useDispatch, useSelector } from 'react-redux';
import { UserAvatar16 } from '@carbon/icons-react';

import { updateProfile } from '../../store/actions/auth';
const {prefix} = settings


const fileUploader= () => {
    return {
      labelTitle:  'Upload image',
      labelDescription: 
        'Max file size is 5mb. Only .jpg files are supported.',
      buttonLabel: "Add profile pic",
      buttonKind: 'primary',
      filenameStatus: 'edit',
      accept: ['.jpg', '.png','.jpeg','.svg'],
      name: "image",
      multiple: false,
      iconDescription: "Upload imge"
    };
}

const TextAreaProps = () => ({
  labelText: 'Group description ',
  placeholder: 'Placeholder text.',
  id: 'test2',
  cols:50,
  rows: 4,
});

/**
 * Setting page
 * show profile update form
 * @component
 */

function Settings() {
  const [isSubmitting, setIsSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);
    const [description, setDescription] = useState('Saving...');
    const [profileImage, setprofileImage] = useState(null)
    const [profileFile, setprofileFile] = useState(null)
    const profile = useSelector(state => state.auth.profile)
    const [ariaLive, setAriaLive] = useState('off');
    const dispatch = useDispatch()
    useEffect(() => {
        if(profile?.image)setprofileImage(profile.image)
       
    }, [profile])

    const handleFileUpload = e=>{
        setprofileImage(URL.createObjectURL(e.target.files[0]));
        setprofileFile(e.target.files[0]);
    }
   const handleSubmit = async (e)=>{
     setAriaLive('asserative');
     setIsSubmitting(true)
     let formData = new FormData(e.target)
     if(profileFile)formData.set("image",profileFile)
     await dispatch(updateProfile(formData));
     setIsSubmitting(false);
        setSuccess(true);
        setDescription('Submitted!');
        setAriaLive('off');
    setTimeout(() => {
          setSuccess(false);
          setDescription('Submitting...');
          setAriaLive('off');
        }, 1500);
   }

     const renderUserProfile = ()=>{
         console.log(profileImage)
       if(profileImage)return (
           <>
           <img src={profileImage} className="profile__avatar"/>
           </>
       )
       return  (<UserAvatar16 className="profile__avatar"/>)
   } 

    return (
         <DashboardLayout>
            <Content
            id="main-content"
            className="chatpage__wrapper settings__wrapper">
            <div className="profile__page">
              <div style={{marginBottom:"1.5rem"}}>
                  <h4>Personal Information</h4>
                  <p>This is where you save your personal info</p>
              </div>
              <div className="profile__form">
                  <form onSubmit={(e)=>handleSubmit(e)}>
                      <FormGroup legendText="avatar" style={{ maxWidth: '800px' }} className="avatar">
                          <div className="profile__user__avatar">
                            {renderUserProfile()}
                          </div>
                       <div className={`${prefix}--file__container`}>
                        <FileUploader {...fileUploader()} onChange={e=>handleFileUpload(e)} />
                        </div>
                      </FormGroup>
                      <FormGroup legendText="Userinfo" style={{ maxWidth: '800px' }}>
                      <div className="profile__in__head">
                            <TextInput
                            id="one"
                            labelText="Username"
                            type="text"
                            required
                            name="username"
                            style={{ marginBottom: '1rem',marginRight:"1rem" }}
                            onChange={(e)=>{}}
                            defaultValue={profile?.username||""}
                        />
                        <TextInput
                            id="one"
                            labelText="Email"
                            type="email"
                            disabled
                            name="email"
                            style={{ marginBottom: '1rem' }}
                            onChange={(e)=>{}}
                            defaultValue={profile?.email||""}
                        />
                      </div>
                      <TextInput
                        id="one"
                        labelText="FullName"
                        type="text"
                        name="fullName"
                        defaultValue={profile?.fullName||""}
                        required
                        style={{ marginBottom: '1rem' }}
                        onChange={(e)=>{}}
                    />
                    <TextArea {...TextAreaProps()} style={{ marginBottom: '1rem' }} onChange={(e)=>{}} name="bio" defaultValue={profile?.bio||""}/>
                    </FormGroup>
                    {isSubmitting || success ? (
            <InlineLoading
              style={{ marginLeft: '1rem' }}
              description={description}
              status={success ? 'finished' : 'active'}
              aria-live={ariaLive}
            />
          ) : (
            <Button kind="primary" type="submit" className="login__button">Save</Button>
          )}
                   
                      
                  </form>
              </div>
            </div>
        </Content>
        </DashboardLayout>
    )
}

export default Settings
