import {useQuery} from "react-query"
import { getMyTeams} from '../http/requests';
/**
 * React fetcher: to get list of current user's teams
 * @param {String} token Authorization token 
 */
const useFetchTeams= (token)=>{
    let {data,isLoading,error,refetch} = useQuery("getTeams",()=>getMyTeams(token=token), {
    refetchOnWindowFocus: true,
    enabled: false // turned off by default, manual refetch is needed
})
   data=data||[];
    return {data,isLoading,error,refetch}
}

export default useFetchTeams