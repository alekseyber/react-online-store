import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useRouter } from "../../hooks/router.hook";


export default () => {
  const { pathname } = useRouter();
  const dispatch = useDispatch();

  useEffect(() => {
    window.scrollTo(0, 0);  
  }, [pathname, dispatch]);

  return null;
};
