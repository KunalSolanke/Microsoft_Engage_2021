import { Send20, Send24, Send32 } from '@carbon/icons-react'
import { TextInput } from 'carbon-components-react'
import React, { useContext, useState } from 'react'
import { SocketContext } from '../../context/GlobalSocketContext'
import "./_style.css"

const TextInputProps= () => ({
    labelText: "Send message",
    placeholder: "Type your message here",
    hideLabel: true,
    id:"sine-id"
  })
function SendMessage({light}) {
    const context = useContext(SocketContext)
    const [text, settext] = useState("")
    return (
        <div className="send_message__block" >
            <TextInput
            tabIndex="0"
            className="send_message"
            light={light}
            type="text"
            {...TextInputProps()}
            value={text}
            onKeyDown={(e)=>{
                if(e.key=="Enter"){
                    settext(e.target.value)
                    context.sendMessage(text)
                    settext("")
                }
            }}
            onChange={(e)=>settext(e.target.value)}
           />
           <Send24 onClick={(e)=>{
               context.sendMessage(text)
               settext("")
           }}/>
        </div>
    )
}

export default SendMessage
