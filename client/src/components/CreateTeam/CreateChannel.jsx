import React, { useState } from 'react'
import {ComposedModal, Link, ModalBody, ModalFooter, ModalHeader, Tag, TextArea, TextInput } from 'carbon-components-react'

import { useMutation } from 'react-query';
import { createChannel, createTeam } from '../../http/requests';
import { setNotification } from '../../store/actions/auth';
import { useDispatch } from 'react-redux';



const TextAreaProps = () => ({
  labelText: 'Group description ',
  placeholder: 'Placeholder text.',
  id: 'test2',
  cols:50,
  rows: 4,
});


function CreateChannel({open,setOpen,refetch,teamID}) {
    const [teamName, setteamName] = useState("")
    const [desc,setdesc] = useState("")
    const dispatch = useDispatch()
    const mutation = useMutation(createChannel,{
        onSuccess:(data,variables,context)=>{
            refetch()
            dispatch(setNotification("Success","new channel created succefully","success"))
        },
        onError:(error,variables, context)=>{
            dispatch(setNotification("Error","Couldn't not create new channel"))
        }
    });
    const handleCreateTeam = ()=>{
        let data={
            channel_name:teamName,
            description:desc,
            is_channel:true,
            team:teamID
        }
        mutation.mutate(data)
        setOpen(false);
    }

    return (
        <div>
            <ComposedModal open={open} onClose={(e)=>setOpen(false)} onRequest>
                <ModalHeader label="Channels" title="Create new channel" />
                <ModalBody hasForm hasScrollingContent>
                    <p style={{ marginBottom: '1rem' }}>
                    You can start a new channel to chat on select topics with your friends.
                    </p>
                    <TextInput
                    data-modal-primary-focus
                    id="text-input-1"
                    labelText="Team name"
                    placeholder="Waccadoodle"
                    style={{ marginBottom: '1rem' }}
                    onChange={(e)=>setteamName(e.target.value)}
                    />
                    <TextArea {...TextAreaProps()} style={{ marginBottom: '1rem' }} onChange={(e)=>setdesc(e.target.value)}/>
                </ModalBody>
                <ModalFooter primaryButtonText="Create" secondaryButtonText="Cancel" onRequestClose={()=>setOpen(false)} onRequestSubmit={()=>handleCreateTeam()} />
                </ComposedModal>
        </div>
    )
}

export default CreateChannel
