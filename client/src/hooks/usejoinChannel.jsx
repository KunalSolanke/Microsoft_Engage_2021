import { useQuery } from "react-query";
import { joinTeam} from "../http/requests";
/**
 * React query : Send join channel request api call
 * @param {*} teamID channel to join
 */

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