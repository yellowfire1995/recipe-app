import Form from "react-bootstrap/Form";

export function ImportSelector({
  searchArray,
  origIdx,
  ingredient,
  setIngredient,
}) {
  try {
    const weightError = isNaN(parseInt(ingredient.userG));
    const conversionRatio = weightError ? 1 : ingredient.userG;

    return (
      <div className="d-inline-flex align-items-center">
        <Form.Control
          required
          key={`input${origIdx}` + ingredient.userG}
          id={ingredient.description}
          type="number"
          min="0"
          step=".01"
          className="form-check-label py-1 pe-2"
          htmlFor={ingredient.id}
          style={{ width: "5rem" }}
          name={ingredient.description}
          defaultValue={
            Math.round(conversionRatio * ingredient.quantity * 100) / 100
          }
          onChange={(e) => {
            setIngredient({
              ...ingredient,
              quantity:
                e.target.valueAsNumber / conversionRatio || ingredient.quantity,
            });
          }}
        />

        <Form.Select
          value={ingredient.id}
          key={`selector${origIdx}`}
          onChange={async (e) => {
            const ingredientIndex = searchArray.findIndex(
              (choice) => choice.id == e.target.value
            );

            setIngredient({
              ...searchArray[ingredientIndex],
              searchArray: searchArray,
              userG: searchArray[ingredientIndex].gramConversion,
              userLabel: searchArray[ingredientIndex].matchedMeasure,
            });
          }}
          className="py-1"
        >
          {searchArray.map((choice, idx) => {
            const activeSelection = choice.id == ingredient.id;
            const choiceMeasurementLabel = activeSelection
              ? ingredient.userLabel
              : choice.matchedMeasure || "";

            const choiceGramsDenomenator =
              choice.userG || choice.gramConversion || 1;

            const ingredientGramsDenomenator = ingredient.userG || 1;

            const choiceGramAmount = activeSelection
              ? Math.round(ingredient.quantity)
              : Math.round(
                  ingredient.quantity *
                    (ingredientGramsDenomenator / choiceGramsDenomenator)
                );

            return (
              <option
                value={choice.id}
                key={`${origIdx}${idx}`}
                id={idx}
                style={{
                  color: choice.gramConversion ? "green" : "black",
                }}
              >
                {`${choiceMeasurementLabel} ${
                  choice.id == ingredient.id
                    ? ingredient.description
                    : choice.description
                } (${choiceGramAmount}g)                
                `}
              </option>
            );
          })}
        </Form.Select>
      </div>
    );
  } catch (error) {
    console.log(error);
    return <div>Error searching for ingredients. Please try again later.</div>;
  }
}
