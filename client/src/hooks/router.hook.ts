import {
  useParams,
  useLocation,
  useHistory,
  useRouteMatch,
} from "react-router-dom";
import { useMemo } from "react";
import queryString, { StringifiableRecord } from "query-string";

const useParamsMemo = <T = {}>() => {
  const params = useParams<T>();
  return useMemo(() => {
    return {
      params,
    };
  }, [params]);
};

const useRouter = () => {
  const params = useParams();
  const location = useLocation();
  const history = useHistory();
  const match = useRouteMatch();

  // Return our custom router object
  // Memoize so that a new object is only returned if something changes
  return useMemo(() => {
    return {
      // For convenience add push(), replace(), pathname at top level
      push: history.push,
      replace: history.replace,
      pathname: location.pathname,
      // Merge params and parsed query string into single "query" object
      // so that they can be used interchangeably.
      // Example: /:topic?sort=popular -> { topic: "react", sort: "popular" }
      query: {
        ...queryString.parse(location.search), // Convert string to object
        ...params,
      },
      params,
      // Include match, location, history objects so we have
      // access to extra React Router functionality if needed.
      match,
      location,
      history,
    };
  }, [params, match, location, history]);
};

export type TStringifiableRecordArrayParams = {
  [x: string]: string[];
};

const useQuery = (
  arrayStatus: boolean = false
): StringifiableRecord | TStringifiableRecordArrayParams => {
  const location = useLocation();
  const search = location.search;

  return useMemo<StringifiableRecord | TStringifiableRecordArrayParams>(() => {
    if (search && search.length) {
      const parseOptions: {
        arrayFormat?: "bracket" | "index" | "comma" | "separator" | "none";
      } = {};
      if (arrayStatus) {
        parseOptions.arrayFormat = "comma";
      }
      const candidat: StringifiableRecord = queryString.parse(
        search,
        parseOptions
      );
      if (arrayStatus) {
        const rezult: TStringifiableRecordArrayParams = {};
        for (const key in candidat) {
          const item = candidat[key];
          if (item) {
            if (Array.isArray(item)) {
              const itemCandidat: string[] = [];
              item.forEach((el) => {
                if (el) {
                  itemCandidat.push(el.toString());
                }
              });
              rezult[key] = itemCandidat; // item;
            } else {
              rezult[key] = [item.toString()];
            }
          }
        }
        return rezult;
      }

      return candidat;
    }
    return {};
  }, [search, arrayStatus]);
};

const useGetQueryPage = (): number => {
  let rezult = 1;
  const query = useQuery();
  const { page } = query;

  if (typeof page === "string" && page) {
    const pageStr: string = page;
    const candidat = parseInt(pageStr, 10);
    if (!isNaN(candidat) && candidat > 1) {
      rezult = candidat;
    }
  }

  return rezult;
};

export { useQuery, useRouter, useGetQueryPage, useParamsMemo };
