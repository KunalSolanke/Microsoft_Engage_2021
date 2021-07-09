import React from 'react'
import {InlineLoading} from "carbon-components-react"
const props = () => ({
  status: 'active',
  iconDescription: 
    'Active loading indicator',
  description: 
    'Loading data...'
});

function LocalLoading() {
    return (
        <div style={{display:"grid",placeItems:"center",width:"100%",height:"100%",marginLeft:"1rem"}}>
            <InlineLoading {...props()} />;
        </div>
    )
}

export default LocalLoading
