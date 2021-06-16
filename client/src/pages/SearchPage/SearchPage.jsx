import React,{useState} from 'react'
import { Search} from "carbon-components-react";
import DashboardLayout from '../../layouts/DashboardLayout/DashboardLayout';
import { useSelector } from 'react-redux';
import { findUsers } from '../../http/requests';
import "./_style.css"
import SearchResult from '../../components/SearchResult/SearchResult';
import UserViewModal from '../../components/UserViewModal/UserViewModal';
import searchImage from "../../assets/images/searchimg.jpeg"
const props = () => ({
  size:  'xl',
  light: false,
  disabled: false,
  name:  '',
  labelText: "Search",
  closeButtonLabelText:
    'Clear search input'
  ,
  placeholder:  'Search',
});

function SearchPage() {
    const [results, setresults] = useState([]);
    const [searchValue, setsearchValue] = useState("")
    const auth = useSelector(state => state.auth);
     const [modelopen, setmodelopen] = useState(false)
      const [user, setuser] = useState(null)
    const  onSearchChange=(e)=>{
        setsearchValue(e.target.value)
        findUsers(e.target.value,auth.token,setresults);
    }
    return (
        <DashboardLayout>
            <div className="search__page">
                  <div className="search_page_wrapper">
                              
                    <div className="search__block">
                        <h3>Search</h3>
                        <p style={{marginBottom:"2rem"}}>Connect with your peers</p>
                        <Search {...props()} onChange={(e)=>onSearchChange(e)} autoFocus={true} value={searchValue}/>
                        <div className="search__results">
                            {
                                results&&results.map(user=>(
                                        <SearchResult key={user.id} user={user} setmodelopen={setmodelopen} setuser={setuser}/>
                                    ))
                                } 
                        </div>
                    </div>
                    <div className="search__image">
                        <div> 
                            <img src={searchImage} />
                            <p style={{marginTop:"1rem"}}>Find your friends with simple keyword search</p>
                       </div>
                    
                    </div>
                    </div>
            </div>
            <UserViewModal user={user} open={modelopen} setmodelopen={setmodelopen}/>
        </DashboardLayout>
    )
}

export default SearchPage
