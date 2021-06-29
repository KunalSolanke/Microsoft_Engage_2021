import { useQuery } from "react-query";
import { joinTeam} from "../http/requests";

const usejoinChannel = (teamID) => {
  const { data, isLoading, error, refetch } = useQuery(
    ["fetch_channel", teamID],
    () => joinTeam(teamID),
    {
      enabled: false,
      refetchOnWindowFocus: false,
    }
  );
  return { data, isLoading, error, refetch };
};

export default usejoinChannel;