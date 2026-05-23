import { useQuery } from "@tanstack/react-query";
import { NavDropdown } from "react-bootstrap";
import { Link } from "react-router-dom";
import { getPublicCollections } from "../../../db/queries";

export function CollectionsDropdown() {
  const { data, isLoading } = useQuery({
    queryKey: ["publicCollections"],
    queryFn: () => getPublicCollections(),
  });

  if (!isLoading && data.length > 0) {
    return (
      <NavDropdown
        title="Collections"
        id="collections"
        align="end"
        className="nav-drop me-1 "
      >
        {data?.map((collection) => {
          return (
            <NavDropdown.Item
              as={Link}
              key={collection.id}
              eventKey={collection.id}
              to={`/collections/${collection.id}`}
              className="nav-drop"
            >
              {collection.name}
            </NavDropdown.Item>
          );
        })}
      </NavDropdown>
    );
  }
}
