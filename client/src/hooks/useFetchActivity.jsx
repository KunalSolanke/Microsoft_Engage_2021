import { useQuery } from "react-query";
import { getActivity, getChat } from "../http/requests";

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
