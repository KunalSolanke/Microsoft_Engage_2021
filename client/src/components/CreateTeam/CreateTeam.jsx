import React, { useState } from 'react'
import { Button, ComboBox, ComposedModal, Link, ModalBody, ModalFooter, ModalHeader, Tag, TextArea, TextInput } from 'carbon-components-react'
import useDebounce from '../../hooks/useDebounce';
import useFetchUsers from '../../hooks/useFecthUsers';
import { useMutation } from 'react-query';
import { createTeam } from '../../http/requests';
import { useHistory } from 'react-router-dom';
 import { useQuery, useQueryClient } from 'react-query'
import { setNotification } from '../../store/actions/auth';
import { useDispatch } from 'react-redux';
import LocalLoading from '../Loading/LocalLoading';
 


const TextAreaProps = () => ({
  labelText: 'Group description ',
  placeholder: 'Placeholder text.',
  id: 'test2',
  cols:50,
  rows: 4,
});


/**
 * Create team modal;
 * this component create teams using create team api
 * @component
 */

function CreateTeam({open,setOpen,refetch}) {
     // Get QueryClient from the context
    const queryClient = useQueryClient()
    const [teamName, setteamName] = useState("")
    const [desc,setdesc] = useState("")
    /**
     * search users to be added to team and add them inside the team users list
     */
    const [users, setusers]= useState([]);
    const remove = (user)=>{
        setusers(users=>{
            users=users.filter(u=>u!=user);
            return user;
        })
    }
    const [searchValue, setsearchValue] = useState("");
    const debouncedQuery = useDebounce(searchValue,500)
    const {results,error,isLoading} = useFetchUsers(debouncedQuery)
    const dispatch = useDispatch()

    /**
     * React query mutation :
     * sends post request to create team api
     */
    const mutation = useMutation(createTeam,{
        onSuccess:(data,variables,context)=>{
            refetch()
            dispatch(setNotification("Success","New Team created successfully","success"))
        },
         onError:(error,variables, context)=>{
            dispatch(setNotification("Error","Couldn't not create new team"))
        }
    });

    /**
     * Submit create team
     */
    const handleCreateTeam = ()=>{
        let data={
            channel_name:teamName,
            description:desc,
            users:users.map(u=>u._id)
        }
        mutation.mutate(data)
        setOpen(false);
    }

    return (
        <div>
            <ComposedModal open={open} onClose={(e)=>setOpen(false)} onRequest>
                <ModalHeader label="Teams" title="Create new team" />
                <ModalBody hasForm hasScrollingContent>
                    <p style={{ marginBottom: '1rem' }}>
                    You can start a private group with your friends to connect to them with ease.
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
                    <ComboBox
                        onChange={(e) => {
                            setusers(users=>[...users,e.selectedItem])
                        }}
                        onInputChange={(e)=>setsearchValue(e)}
                        id="carbon-combobox"
                        items={results||[]}
                        light
                        itemToString={(item) => (item ? item.username||item.email : '')}
                        placeholder="Filter..."
                        titleText="Select friends you want to add."
                        helperText="You can send them link to join group later."
                    />
                    {isLoading?<LocalLoading/>:null}
                    <div className="tags">
                         {users&&users.map(u=>(<Tag className="some-class" filter onClose={(e)=>remove(u)}>
                               {u.username||u.email}..
                            </Tag>))
                        }
                    </div>
                </ModalBody>
                <ModalFooter primaryButtonText="Create" secondaryButtonText="Cancel" onRequestClose={()=>setOpen(false)} onRequestSubmit={()=>handleCreateTeam()} />
                </ComposedModal>
        </div>
    )
}

export default CreateTeam
