import { useEffect } from "react";
import { useRouter } from "../../hooks/router.hook";

const RouterToTop: React.FC = () => {
  const { pathname } = useRouter();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

export default RouterToTop;
