export function NutritionFactsHeader(props) {
  const recipe = props.recipe;
  const [servings, setServings] = props.servings;

  return (
    <header className={`performance-facts__header`}>
      <h1 className="performance-facts__title">Nutrition Facts</h1>
      {recipe.yieldNumber ? (
        <p>{`Yield ${
          (recipe.yieldNumber * (servings ?? recipe.servings)) / recipe.servings
        } ${recipe.yieldDescription}`}</p>
      ) : (
        ""
      )}
      <p>
        Servings per Recipe
        <input
          type="number"
          id="servings"
          min="0"
          value={servings ?? recipe.servings}
          onChange={(event) => setServings(event.target.value)}
          style={{ width: "3rem" }}
          className="me-2"
        />
      </p>
    </header>
  );
}
