import { FC } from "react";
import { useQuery } from "../../hooks/router.hook";
import { PageBase } from "../../hoc/PageBase";
import Search from "../../containers/search/Search";
import { RouteNames } from "../../router";

const SearchPage: FC = () => {
  const query = useQuery();
  const { q } = query;
  const qStr = q ? q.toString() : "";
  const title = 'Поиск по запросу: "' + qStr + '"';

  const bind = {
    name_page: "Поиск",
    action_page: title,
    link_page: RouteNames.SEARCH_PAGE,
    title,
    filter_on: true,
  };

  return (
    <PageBase {...bind}>
      <Search q={qStr} />
    </PageBase>
  );
};

export default SearchPage;
