import { ArrowDownward, FilterAlt } from "@mui/icons-material";
import GridViewIcon from "@mui/icons-material/GridView";
import ListAltIcon from "@mui/icons-material/ListAlt";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Button, Col, Collapse, Form, Row } from "react-bootstrap";
import { useParams, useSearchParams } from "react-router-dom";
import {
  getCollectionCategories,
  getUsedCategories,
} from "../../../db/queries";

export function RecipeSearchOptionsBar({ setIsListView }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const pageSize = searchParams.get("pageSize");
  const sort = searchParams.get("sort");
  const category = searchParams.get("category");
  const { collectionId } = useParams();
  const [showFilters, setShowFilters] = useState(false);

  const { data } = useQuery({
    queryKey: ["CategoryList", collectionId],
    queryFn: () => {
      return collectionId
        ? getCollectionCategories({ collectionId })
        : getUsedCategories();
    },
  });

  return (
    <>
      <Row className="d-lg-none mb-2 mt-3 mobile">
        <Col>
          <Button
            variant="primary"
            className="w-100 d-flex align-items-center"
            onClick={() => setShowFilters(!showFilters)}
            aria-controls="mobile-filters"
            aria-expanded={showFilters}
          >
            <FilterAlt className="my-auto" /> Filters
            <ArrowDownward
              className="ms-auto"
              style={{
                transform: showFilters ? "rotate(180deg)" : "rotate(0)",
                transition: "transform 0.2s",
              }}
            />
          </Button>
          <Collapse in={showFilters}>
            <div id="mobile-filters" className="mobile-filter-panel">
              <Row className="mt-2 g-2">
                <Col xs={6}>
                  <label className="form-label">Sort by</label>
                  <Form.Select
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
                <Col xs={6}>
                  <label className="form-label">Results per page</label>
                  <Form.Select
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
                <Col xs={6}>
                  <label className="form-label">Categories</label>
                  <Form.Select
                    value={category || ""}
                    onChange={(e) =>
                      setSearchParams({
                        ...Object.fromEntries(searchParams),
                        category: e.target.value,
                      })
                    }
                  >
                    <option value="">Select...</option>
                    {data &&
                      data.map((category) => (
                        <option
                          key={category.category_id}
                          value={category.category_id}
                        >
                          {category.category}
                        </option>
                      ))}
                  </Form.Select>
                </Col>
                <Col xs={6}>
                  <label className="form-label">View</label>
                  <div className="d-flex align-items-center gap-2">
                    <GridViewIcon
                      className="svg-icon"
                      onClick={() => setIsListView(false)}
                    />
                    |
                    <ListAltIcon
                      className="svg-icon"
                      onClick={() => setIsListView(true)}
                    />
                  </div>
                </Col>
              </Row>
            </div>
          </Collapse>
        </Col>
      </Row>
      <Row className="mb-3 justify-content-around mt-3 d-none d-lg-flex">
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
          <ListAltIcon
            className="svg-icon"
            onClick={() => setIsListView(true)}
          />
        </Col>
        <Col className="align-items-center d-flex" xs="auto">
          <label htmlFor="numberOfResults"> Categories:</label>

          <Form.Select
            id="categories"
            style={{ width: "fit-content" }}
            value={category || ""}
            onChange={(e) =>
              setSearchParams({
                ...Object.fromEntries(searchParams),
                category: e.target.value,
              })
            }
          >
            <option value="">Select...</option>
            {data &&
              data.map((category) => (
                <option key={category.category_id} value={category.category_id}>
                  {category.category}
                </option>
              ))}
          </Form.Select>
        </Col>
      </Row>
    </>
  );
}
