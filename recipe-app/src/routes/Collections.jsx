import { useParams } from "react-router-dom";
import { getRecipeCards } from "../../db/queries";
import { MultiRecipeViewer } from "../Components/Recipes/MultiRecipeViewer/MultiRecipeViewer";

export default function CollectionRecipesPage() {
  const { collectionId } = useParams();

  return (
    <>
      <title>CookbookCalc | Collections</title>

      <MultiRecipeViewer
        query={getRecipeCards}
        queryParams={{ collectionId: collectionId }}
        queryKey={`Collection${collectionId}`}
      />
    </>
  );
}
