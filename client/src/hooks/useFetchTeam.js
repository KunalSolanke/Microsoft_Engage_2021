import { useQuery } from "react-query";
import { getTeam } from "../http/requests";
/**
 * React query fetcher to get individual team
 * @param {String} teamID get team by TeamIDs
 */

const useFetchTeam = (teamID) => {
  const { data, isLoading, error, refetch } = useQuery(
    ["fech_team", teamID],
    () => getTeam(teamID),
    {
      enabled: false,
      refetchOnWindowFocus: false,
    }
  );
  return { data, isLoading, error, refetch };
};

export default useFetchTeam;
