import { useQuery } from "react-query";
import { getChat } from "../http/requests";

/**
 * React query api fetcher to fetch chat
 * @param {String} chatID Get chat by chatId
 */
const useFetchChat = (chatID) => {
  const { data, isLoading, error, refetch } = useQuery(
    ["fech_chat", chatID],
    () => getChat(chatID),
    {
      enabled: false,
      refetchOnWindowFocus: false,
    }
  );
  return { data, isLoading, error, refetch };
};

export default useFetchChat;
