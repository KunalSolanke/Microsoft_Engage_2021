import { useQuery } from "react-query";
import { getTeam } from "../http/requests";

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
