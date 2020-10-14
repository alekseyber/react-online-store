import React, { useMemo } from "react";
import PropTypes from "prop-types";
import ProductsGrid from "../../containers/productsgrid/ProductsGrid";
import LoaderContent from "../../components/loadercontent/LoaderContent";
import NullPageContent from "../../components/nullpagecontent/NullPageContent";
import { SEARCH_FULL_QUERY } from "../../graphql/gqlQuery";
import { useQueryApp } from "../../hooks/appolloQueryApp.hook";

const Search = ({ q }) => {
  const { data, loading } = useQueryApp(SEARCH_FULL_QUERY, { q });
  const productList = useMemo(() => {
    if (data) {
      if (data.searchFull.list.length) {
        return data.searchFull.list;
      }
      if (data.searchFull.fetchList.length) {
        return data.searchFull.fetchList;
      }
    }

    return [];
  }, [data]);

  if (loading) {
    return <LoaderContent text="Поиск на сервере..." />;
  }

  if (productList.length === 0) {
    return (
      <NullPageContent
        title="По данному запросу результатов не найдено."
        str="Попробуйте изменить поисковую фразу."
      />
    );
  }

  return <ProductsGrid products={productList} />;
};

Search.propTypes = {
  q: PropTypes.string.isRequired,
};

export default Search;
