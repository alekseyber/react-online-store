import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useRouter } from "../../hooks/router.hook";
import { updateStart } from "../../redux/actions/start";

export default () => {
  const { pathname } = useRouter();
  const dispatch = useDispatch();

  useEffect(() => {
    window.scrollTo(0, 0);
    dispatch(updateStart());
  }, [pathname, dispatch]);

  return null;
};
