import { useQuery } from "react-query";
import { getChannel} from "../http/requests";

/**
 * React query:fetcher to fetch teams channel info
 * @param {String} channelID channelID of current channels
 */

const useFetchChannel = (channelID) => {
  const { data, isLoading, error, refetch } = useQuery(
    ["fetch_channel", channelID],
    () => getChannel(channelID),
    {
      enabled: false,
      refetchOnWindowFocus: false,
    }
  );
  return { data, isLoading, error, refetch };
};

export default useFetchChannel;
