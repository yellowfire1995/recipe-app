// import { useMutation } from "@tanstack/react-query";
// import Card from "react-bootstrap/Card";
// import Container from "react-bootstrap/esm/Container";
// import { Link } from "react-router-dom";
// import { toast } from "react-toastify";
// import { deleteRating, updateRating } from "../../../../../db/queries";
// import { RecipeRating } from "../../Rating/RecipeRating";

import { Card, Container } from "react-bootstrap";
import { Link } from "react-router-dom";
import { RecipeRating } from "../../Rating/RecipeRating";

// export default function RecipeCardData({ cards, setCards, refetch }) {
//   const { mutateAsync, mutate } = useMutation({
//     mutationFn: ({ recipeId, userRating, deleter }) => {
//       if (deleter) {
//         return deleteRating(recipeId, userRating);
//       }
//       return updateRating(recipeId, userRating);
//     },
//     onError: (error) => {
//       console.log(error);
//       toast.error("Error saving rating, please try again.");
//     },
//   });

//   const updateCardRating = async (id, e) => {
//     const newRating = parseInt(e.target.value);
//     const updatedCards = await Promise.all(
//       cards.map(async (card) => {
//         if (card.recipeId == id) {
//           if (newRating === card.userRating) {
//             await mutateAsync({
//               recipeId: card.recipeId,
//               deleter: true,
//             });

//             return { ...card, userRating: null, rating: null };
//           } else {
//             mutate({
//               recipeId: card.recipeId,
//               userRating: newRating,
//               deleter: false,
//             });
//             return { ...card, userRating: newRating };
//           }
//         } else {
//           return { ...card };
//         }
//       })
//     );
//     setCards(updatedCards);
//     refetch();
//   };

//   if (cards.length < 1) {
//     return <div>No Recipes found.</div>;
//   }

//   return (
//     <>
//       {cards.map((recipe, index, collection, planner) => {
//         return (
//           <Container
//             className="mb-3  scrollable d-flex text-center recipe-card align-self-stretch  justify-content-center flex-wrap align-content-start"
//             id={`slide-${
//               collection ? collection.id : planner ? planner : ""
//             }-${index}`}
//             key={recipe.recipeId}
//           >
//             <Container className="rating-background">
//               <RecipeRating
//                 recipe={recipe}
//                 onChange={(e) => {
//                   updateCardRating(recipe.recipeId, e);
//                 }}
//               />
//             </Container>
//             <Link
//               to={`/recipes/${recipe.recipeId}`}
//               className="d-flex p-2 text-decoration-none rounded flex-wrap text-body"
//             >
//               <Card
//                 className="d-flex border-0 shadow recipe-card-background"
//                 style={{
//                   backgroundImage: `url(${recipe.thumbnailLink})`,
//                 }}
//               >
//                 <Container className="justify-content-center text-center filler-text my-auto">
//                   {recipe.thumbnail ? "" : recipe.name}
//                 </Container>
//               </Card>
//             </Link>

//             <p
//               className="d-flex align-self-start pt-1 text-secondary-subtle text-break"
//               style={{
//                 maxWidth: "15rem",
//               }}
//             >
//               {recipe.name}
//             </p>
//           </Container>
//         );
//       })}
//     </>
//   );
// }

export function RecipeCardItem({
  recipe = {},
  refetch = () => {
    return;
  },
  id = "",
  collectionId = "",
  ...props
}) {
  return (
    <>
      <Container
        id={id + "" + collectionId}
        className="mb-3  scrollable d-flex text-center recipe-card align-self-stretch  justify-content-center flex-wrap align-content-start"
        key={recipe.recipeId}
        {...props}
      >
        <Container className="rating-background">
          <RecipeRating recipe={recipe} refetch={refetch} />
        </Container>
        <Link
          to={`/recipes/${recipe.recipeId}`}
          className="d-flex p-2 text-decoration-none rounded flex-wrap text-body"
        >
          <Card
            className="d-flex border-0 shadow recipe-card-background"
            style={{
              backgroundImage: `url(${recipe.thumbnailLink})`,
            }}
          >
            <Container className="justify-content-center text-center filler-text my-auto">
              {recipe.thumbnail ? "" : recipe.name}
            </Container>
          </Card>
        </Link>

        <p
          className="d-flex align-self-start pt-1 text-secondary-subtle text-break"
          style={{
            maxWidth: "15rem",
          }}
        >
          {recipe.name}
        </p>
      </Container>
    </>
  );
}
