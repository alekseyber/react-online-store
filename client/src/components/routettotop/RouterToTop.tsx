import { useEffect, FC } from "react";
import { useLocation } from "react-router-dom";
//import { ContextAnalitics } from "../../hoc/AnaliticsProvider";
//import { useRouter } from "../../hooks/router.hook";

const RouterToTop: FC = () => {
  let location = useLocation();
  // const { pathname } = useRouter();
  // const { gaAddPage } = useContext(ContextAnalitics);

  useEffect(() => {
    window.scrollTo(0, 0);
    // if (gaAddPage) {
    //   gaAddPage(pathname);
    // }
  }, [location]);

  return null;
};

export default RouterToTop;
