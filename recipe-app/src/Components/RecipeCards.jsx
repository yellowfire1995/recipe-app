import RecipeCardData from "./RecipeCard.jsx";
import { useInfiniteQuery } from "@tanstack/react-query";
import Loading from "./Loading.jsx";
import { useInView } from "react-intersection-observer";
import { useEffect } from "react";

export default function RecipeCards(props) {
  const { ref, inView } = useInView();

  const cardsQuery = useInfiniteQuery({
    queryKey: [props.queryKey],
    queryFn: props.fetcher,
    initialPageParam: 0,
    getNextPageParam: (lastPage) => {
      return lastPage?.cursor;
    },
  });

  useEffect(() => {
    if (inView && cardsQuery.hasNextPage) {
      cardsQuery.fetchNextPage();
    }
  }, [inView, cardsQuery.hasNextPage, cardsQuery.fetchNextPage()]);

  if (cardsQuery.isError) {
    return <div>An error has occured</div>;
  }

  return (
    <>
      {cardsQuery.isLoading ? (
        <Loading />
      ) : (
        <>
          <RecipeCardData pages={cardsQuery.data.pages} />
        </>
      )}
      <div ref={ref}></div>
    </>
  );
}
