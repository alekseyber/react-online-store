import { useEffect, FC, useContext } from "react";
import { ContextAnalitics } from "../../hoc/AnaliticsProvider";
import { useRouter } from "../../hooks/router.hook";

const RouterToTop: FC = () => {
  const { pathname } = useRouter();
  const { gaAddPage } = useContext(ContextAnalitics);

  useEffect(() => {
    window.scrollTo(0, 0);
    if (gaAddPage) {
      gaAddPage(pathname);
    }
  }, [pathname, gaAddPage]);

  return null;
};

export default RouterToTop;
