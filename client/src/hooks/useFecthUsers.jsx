import {useQuery} from "react-query"
import { findUsers } from '../http/requests';
const useFetchUsers = (search)=>{
    const {data,error,isLoading} = useQuery(["fetchUsers",search],()=>{
       if(search.length>=2)return findUsers(search)
       return []
    });
    return {results:data,error,isLoading}
}
export default useFetchUsers;
