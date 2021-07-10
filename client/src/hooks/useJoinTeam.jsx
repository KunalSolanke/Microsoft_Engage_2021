import { useQuery } from "react-query";
import { joinTeam } from "../http/requests";
/**
 * React query : Send join team request api call
 * @param {*} teamID team to join
 */
const useJoinTeam = (teamID) => {
  const { data, isLoading, error, refetch } = useQuery(
    ["fech_team", teamID],
    () => joinTeam(teamID),
    {
      enabled: false,
      refetchOnWindowFocus: false,
    }
  );
  return { data, isLoading, error, refetch };
};

export default useJoinTeam;
