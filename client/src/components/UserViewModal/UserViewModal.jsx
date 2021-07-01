import { Chat24, Phone20, UserAvatar16, UserProfileAlt24 } from '@carbon/icons-react'
import { Button, ComposedModal, Link, ModalBody, ModalFooter, ModalHeader } from 'carbon-components-react'
import React, { createContext, useContext } from 'react'
import { SocketContext } from '../../context/GlobalSocketContext'
import { addContact } from '../../http/requests'
import {useMutation} from "react-query"
import "./_style.css"
import { useHistory } from 'react-router-dom'

function UserViewModal({user,open,setmodelopen}) {
    const history = useHistory();
    const mutation = useMutation(addContact,{
        onSuccess:(data,variables,context)=>{
              history.push(`/dashboard/chat/${data._id}`)
        }
    });

    const context = useContext(SocketContext);
    const onCall = (e)=>{
        context.callUser({user});
    }
    const onAddContact = ()=>{
        //console.log("Adding user to contacts")
        mutation.mutate(user._id)
    }
    return (
        <div>
            <ComposedModal open={open} onClose={(e)=>setmodelopen(false)}>
                <ModalHeader label="User Profile" title={user?.username} />
                {open&&<ModalBody>
                  <div className="user_modal_content">
                         {
                            user.image?(<img src={user.image} className="user_search_avatar"/>):
                            (<UserAvatar16 className="user_modal_avatar"/>)
                        }
                      <div className="user_profile_data">
                          <h6>{user.fullName||user.username}</h6>
                          <Link href="#">{user.email}</Link>
                        <p style={{ marginBottom: '1rem' }}>
                            {user.bio}
                        </p>
                      </div>
                  </div>
                   <div className="modal_actions">
                       <Chat24 onClick={() => {
                         onAddContact();
                        setmodelopen(false);
                     }}/>
                       <Phone20 onClick={(e)=>onCall(e)}/>
                  </div>
                </ModalBody>
               }
                <ModalFooter primaryButtonDisabled>
                <Button
                    kind="secondary"
                    onClick={() => {
                         onAddContact();
                        setmodelopen(false);
                     }}>
                    Add to Contact
                </Button>
                </ModalFooter>
            </ComposedModal>
        </div>
    )
}

export default UserViewModal
