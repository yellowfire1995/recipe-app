import _ from "lodash";
import { Form } from "react-bootstrap";
import {
  matchPath,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router-dom";

export function SearchBox() {
  const debouncedSearch = _.debounce(
    (value, setSearchParams, navigate, location, pageSize) => {
      const validPaths = [
        "/myrecipes",
        "/recipes",
        "/collections/:collectionId",
      ];
      const validLocation = validPaths.some((pattern) =>
        matchPath(pattern, location.pathname),
      );
      const params = pageSize ? { search: value, pageSize } : { search: value };
      !validLocation && navigate("/recipes");
      value.length !== 1 && setSearchParams(params);
    },
    200,
  );

  const [searchParams, setSearchParams] = useSearchParams();
  const searchQuery = searchParams.get("search");
  const pageSize = searchParams.get("pageSize");
  const location = useLocation();

  const navigate = useNavigate();

  return (
    <Form.Control
      type="search"
      id="searchBox"
      placeholder="Search"
      className="mainSearchBox me-2"
      aria-label="Search"
      onChange={(e) =>
        debouncedSearch(
          e.target.value,
          setSearchParams,
          navigate,
          location,
          pageSize,
        )
      }
      defaultValue={searchQuery ? searchQuery : ""}
    />
  );
}
