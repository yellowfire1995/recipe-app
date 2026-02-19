import GridViewIcon from "@mui/icons-material/GridView";
import ListAltIcon from "@mui/icons-material/ListAlt";
import { Col, Form, Row } from "react-bootstrap";
import { useSearchParams } from "react-router-dom";

export function RecipeSearchOptionsBar({ setIsListView }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const pageSize = searchParams.get("pageSize");
  const sort = searchParams.get("sort");

  return (
    <Row className="mb-3 justify-content-around mt-3">
      <Col className="d-flex align-items-center" xs="auto">
        <label htmlFor="numberOfResults"> Sort by:</label>

        <Form.Select
          id="sortBy"
          style={{ width: "fit-content" }}
          defaultValue={sort || "newest"}
          onChange={(e) =>
            setSearchParams({
              ...Object.fromEntries(searchParams),
              sort: e.target.value,
            })
          }
        >
          <option value="nameDesc">Name descending</option>
          <option value="nameAsc">Name ascending</option>
          <option value="newest">Newest</option>
          <option value="oldest">Oldest</option>
        </Form.Select>
      </Col>
      <Col className="d-flex align-items-center" xs="auto">
        <label htmlFor="numberOfResults"> Results per page:</label>

        <Form.Select
          id="numberOfResults"
          style={{ width: "fit-content" }}
          defaultValue={pageSize || "15"}
          onChange={(e) =>
            setSearchParams({
              ...Object.fromEntries(searchParams),
              pageSize: e.target.value,
            })
          }
        >
          <option value="10">10</option>
          <option value="15">15</option>
          <option value="30">30</option>
          <option value="50">50</option>
        </Form.Select>
      </Col>
      <Col className="align-items-center d-flex" xs="auto">
        View:
        <GridViewIcon
          className="svg-icon"
          onClick={() => setIsListView(false)}
        />
        |
        <ListAltIcon className="svg-icon" onClick={() => setIsListView(true)} />
      </Col>
    </Row>
  );
}
