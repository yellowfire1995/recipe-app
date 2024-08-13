import { useMutation } from "@tanstack/react-query";
import { Button } from "react-bootstrap";
import { useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import { deleteCollectionRecipe } from "../../../../db/queries";
import { queryClient } from "../../../main";

export function RemoveFromCollectionButton({ recipe }) {
  const [searchParams] = useSearchParams();
  const page = searchParams.get("page");
  const search = searchParams.get("search");
  const pageSize = searchParams.get("pageSize");
  const sort = searchParams.get("sort");
  const { collectionRecipeId, collectionId } = recipe;

  const { mutate } = useMutation({
    mutationFn: () => {
      return deleteCollectionRecipe([collectionRecipeId]);
    },
    onError: () =>
      toast.error("Error deleting recipe from collection, please try again."),
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: [`Collection${collectionId}`, page, search, pageSize, sort],
      }),
  });

  return <Button onClick={mutate}>Remove from Collection</Button>;
}
