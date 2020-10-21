import React from "react";
import PropTypes from "prop-types";
import { Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import ProductsGrid from "../productsgrid/ProductsGrid";
import PageContent from "../../components/pagecontent/PageContent";
import { useFilterProduct } from "../../hooks/filterproduct.hook";
import { removeFilterSelect } from "../../graphql/localVarsFilter";
import { PageBase } from "../../hoc/PageBase";
import { useGetQueryPage } from "../../hooks/router.hook";

const useStyles = makeStyles((theme) => ({
  products: {
    marginTop: theme.spacing(5),
    marginBottom: theme.spacing(5),
  },
  emptyproducts: {
    marginTop: theme.spacing(5),
    marginBottom: theme.spacing(5),
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
    "& > div": {
      marginTop: theme.spacing(2),
      textAlign: "center",
    },
  },
  title: {
    marginTop: theme.spacing(4),
    marginBottom: theme.spacing(2),
    fontWeight: 700,
  },
  content: {
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(5),
  },
}));

const Category = ({ data, alias }) => {
  const classes = useStyles();
  const page = useGetQueryPage();

  const { filterData, category, productsCategory } = data;

  const { contCategoryData, productsCategoryData } = category;

  const products = productsCategory.productsList;
  const { colors, filter, level2 } = productsCategoryData;
  const productsData = useFilterProduct({
    colors,
    filter,
    level2,
    products,
    filterData,
  });
  const productsTotal = products.length;
  const canonical = `/category/${alias}`;

  const handleClear = () => {
    removeFilterSelect();
  };

  const bind = {
    name_page: contCategoryData.meta_title,
    action_page: contCategoryData.meta_description,
    meta_key: contCategoryData.meta_keywords,
    link_page: canonical,
    title: contCategoryData.htitle,
    filter_on: true,
    meta_full: true,
    canonical_on: true,
    breadcrumbs_add: false,
    filterInputRezult: productsData.filterRezult,
    breadcrumbs_data: contCategoryData.breadcrumbs,
    page,
  };

  return (
    <PageBase {...bind}>
      {productsTotal > 0 && (
        <div className={classes.products}>
          <ProductsGrid products={productsData.products} page={page} />
        </div>
      )}
      {productsTotal === 0 && (
        <div className={classes.emptyproducts}>
          {productsData.selectedFilter && (
            <>
              <Typography variant="h6" component="h2" align="center">
                С учетом текущих критериев фильтрации товаров не найдено.
              </Typography>
              <Typography variant="body1" component="p" align="center">
                Попробуйте изменить критерии для выбора товаров или очистить
                фильтр.
              </Typography>
              <div>
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={handleClear}
                >
                  Очистить фильтр
                </Button>
              </div>
            </>
          )}
          {!productsData.selectedFilter && (
            <>
              <Typography variant="h6" component="h2" align="center">
                К сожалению данная категория пока не содержит товаров.
              </Typography>
            </>
          )}
        </div>
      )}
      {page === 1 && <PageContent content={contCategoryData.content} />}
    </PageBase>
  );
};

Category.propTypes = {
  data: PropTypes.object.isRequired,
  alias: PropTypes.string.isRequired,
};

export default Category;
