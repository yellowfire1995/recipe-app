import RecipeCards from "../Components/RecipeCards";
import Sidebar from "../Components/Sidebar";
import { getCollectionRecipes } from "../../db/queries";
import Col from "react-bootstrap/esm/Col.js";
import { Button } from "bootstrap";
import { useQuery } from "@tanstack/react-query";
import RecipeCardData from "../Components/RecipeCard";

export default function Collections() {
  const collections = useQuery({
    queryKey: ["Collections"],
    queryFn: () => getCollectionRecipes(),
  });

  if (collections.isError) {
    console.log(collections.error);
    return <div>Recipe not found</div>;
  }

  if (!collections.isLoading) {
    console.log(collections.data);
    return (
      <>
        {collections.data.map((collection) => {
          return (
            <>
              <h5 key={collection.id}>{collection.name}</h5>
              <RecipeCardData cards={collection.recipes} />
            </>
          );
        })}
      </>
    );
  }
}
