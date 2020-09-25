import React, { useState, useEffect, useMemo } from "react";
import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";
import { useHttp } from "../../hooks/http.hook";
import ProductsGrid from "../../containers/productsgrid/ProductsGrid";
import { updateProducts } from "../../redux/actions/products";
import LoaderContent from "../../components/loadercontent/LoaderContent";
import NullPageContent from "../../components/nullpagecontent/NullPageContent";

const Search = ({ q }) => {
  const dispatch = useDispatch();
  const { requestNoErrMsg } = useHttp();

  const productsData = useSelector((state) => state.products);

  const initial = {
    loader: true,
    list: [],
    color: [],
  };
  const [rezult, setRezult] = useState(initial);

  const { loader, list, color } = rezult;

  useEffect(() => {
    setRezult({
      loader: true,
      list: [],
      color: [],
    });

    return () => {
        setRezult({
            loader: true,
            list: [],
            color: [],
          });
    }

  }, [q]);

  useEffect(() => {
    
    const fetchData = async () => {
      const rez = {
        loader: false,
        list: [],
        color: [],
      };
      try {
        if (q.length) {
          const { products, filter } = await requestNoErrMsg(
            "/api/search/full",
            "get",
            { q }
          );
          rez.list = products;

          if (products.length) {
            await dispatch(updateProducts(products));
            if (filter.count && filter.selected) {
              rez.color = filter.selected.color ?? [];
            }
          }
        }
      } catch (e) {
        console.error(e);
      } finally {
        setRezult(rez);
      }
    };

    fetchData();
  }, [q, dispatch, requestNoErrMsg]);

  const productList = useMemo(() => {
    if (list.length === 0) {
      return list;
    }

    if (color.length) {
      const productsColor = [];
      list.forEach((item) => {
        if (item.alias in productsData) {
          const ptoductItem = productsData[item.alias];
          color.forEach((itemcolor) => {
            if (itemcolor in ptoductItem.level1) {
              const product = {
                alias: item.alias,
                colorselect: itemcolor,
              };
              productsColor.push(product);
            }
          });
        }
      });

      return productsColor;
    } else {
      return list;
    }
  }, [list, color, productsData]);

  if (loader) {
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
