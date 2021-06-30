import { useQuery } from "react-query";
import { getActivity, getChat } from "../http/requests";

const useFetchActivity = () => {
  const { data, isLoading, error, refetch } = useQuery(
    ["get_activity"],getActivity,
    {
      enabled: false,
      refetchOnWindowFocus: false,
    }
  );
  return { data, isLoading, error, refetch };
};

export default useFetchActivity;
