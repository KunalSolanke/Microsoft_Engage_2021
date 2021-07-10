import { useQuery } from "react-query";
import { getActivity, getChat } from "../http/requests";
/**
 * React query api fetcher to fetch user calendar/feeds
 * @param {*} d Optional find activity by duration 
 */
const useFetchActivity = (d={}) => {
  let { data, isLoading, error, refetch } = useQuery(
    ["get_activity"],()=>getActivity(d),
    {
      enabled: false,
      refetchOnWindowFocus: false,
    }
  );
  data=data||[];
  return { data, isLoading, error, refetch };
};

export default useFetchActivity;
