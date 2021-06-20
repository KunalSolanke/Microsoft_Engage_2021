// useActionCreators.js
import useStore from "./useStore";
function useActionCreators(...creators) {
  const [, dispatch] = useStore();
  return creators.map((creator) => (...param) => dispatch(creator(...param)));
}

export default useActionCreators;
