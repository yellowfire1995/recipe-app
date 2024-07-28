import Form from "react-bootstrap/Form";

export function ImportSelector({
  searchArray,
  origIdx,
  ingredient,
  setIngredient,
}) {
  try {
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
            Math.round(
              (ingredient.userG || ingredient.gramConversion || 1) *
                ingredient.quantity *
                100
            ) / 100
          }
          onChange={(e) => {
            setIngredient({
              ...ingredient,
              quantity:
                e.target.valueAsNumber /
                  (ingredient.userG || ingredient.gramConversion || 1) ||
                ingredient.quantity,
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
            });
          }}
          className="py-1"
        >
          {searchArray.map((choice, idx) => {
            return (
              <option
                value={choice.id}
                key={`${origIdx}${idx}`}
                id={idx}
                style={{
                  color: choice.gramConversion ? "green" : "black",
                }}
              >
                {`${
                  ingredient.userLabel
                    ? ingredient.userLabel
                    : choice.matchedMeasure
                    ? choice.matchedMeasure
                    : "g"
                } ${
                  choice.id == ingredient.id
                    ? ingredient.description
                    : choice.description
                } ${
                  choice.userG || choice.gramConversion
                    ? Math.round(
                        ((ingredient.quantity * ingredient.gramConversion ||
                          ingredient.userG ||
                          1) /
                          (choice.userG || choice.gramConversion)) *
                          100
                      ) /
                        100 +
                      "g"
                    : "(No density information)"
                }`}
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
