import { useRecipeContext } from "../RecipeContextProvider";

export function AddPhotoPopupImage({
  photoFile,
  setPhotoFile,
  setDeleteKeys,
  deleteKeys,
}) {
  const { recipe } = useRecipeContext();

  if (photoFile) {
    return (
      <div
        className="recipe-scan-image"
        onClick={() => {
          setPhotoFile();
        }}
      >
        <img src={URL.createObjectURL(photoFile)} />
        {Math.round((photoFile.size / 1024 / 1024) * 100) / 100} MB
      </div>
    );
  } else if (recipe.imgUrl && deleteKeys.length < 1) {
    return (
      <div
        className="recipe-scan-image"
        onClick={() => {
          setDeleteKeys([recipe.imgName, recipe.thumbnail]);
        }}
      >
        <img src={recipe.imgUrl} />
      </div>
    );
  }
}
