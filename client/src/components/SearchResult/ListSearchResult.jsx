import React from 'react'
import useDebounce from '../../hooks/useDebounce'
import useFetchUsers from '../../hooks/useFecthUsers'
import LocalLoading from '../Loading/LocalLoading'
import SearchResult from './SearchResult'

function ListSearchResult({searchValue,setmodelopen,setuser}) {
    const debouncedQuery = useDebounce(searchValue,1200)
    const {results,error,isLoading} = useFetchUsers(debouncedQuery)
    return (
        <div className="search__results">
                {
                    isLoading?<LocalLoading/>:(
                    results&&results.map(user=>(
                            <SearchResult key={user.id} user={user} setmodelopen={setmodelopen} setuser={setuser}/>
                        )) 
                    )
                }
        </div>
    )
}

export default ListSearchResult
