import { ArrowUpRight16, UserProfile24 } from '@carbon/icons-react'
import { Link } from 'carbon-components-react'
import React, { useState } from 'react'
import "./_style.css"

export default function SearchResult({user,setuser,setmodelopen}) {
   
    const openUserModel = (e)=>{ 
        setuser(user)
        setmodelopen(prev=>!prev);
    }
    return (
        <div onClick={(e)=>openUserModel(e)} className="search__result__item">
            {
                user.image?(<img src={user.image} className="user_search_avatar"/>):
                (<UserProfile24 className="user_search_avatar"/>)
            }
            <div className="user__data">
                <h6>{user.username}</h6>
                <p >{user.email}</p>
            </div>
            <ArrowUpRight16/>
            
        </div>
    )
}
