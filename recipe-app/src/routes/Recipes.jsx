import { Link, useLoaderData, useNavigate } from "react-router-dom";
import ListGroup from "react-bootstrap/ListGroup";
import CardImg from "react-bootstrap/esm/CardImg";
import Container from "react-bootstrap/esm/Container";
import { useEffect, useState, useRef } from "react";
import { getRecipeById } from "../../db/queries";
import Col from "react-bootstrap/esm/Col";
import Row from "react-bootstrap/esm/Row";
import Button from "react-bootstrap/Button";
import axios from "axios";
import Badge from "react-bootstrap/Badge";
import Stack from "react-bootstrap/Stack";

export async function loader({ params }) {
  const activeRecipe = await getRecipeById(params.recipeId);

  return activeRecipe;
}

export default function Recipe() {
  const [nutrition, setNutrition] = useState([]);

  const activeRecipe = useLoaderData();
  const recipe = activeRecipe[0];
  const navigate = useNavigate();
  const [servings, setServings] = useState(recipe.servings);
  const servs = servings / recipe.servings;
  const [checkedArray, setCheckedArray] = useState([]);

  const recipePrice = (
    Math.round(
      recipe.ingredients
        .map((ingredient) => ingredient.price * ingredient.amt * servs)
        .reduce((partialSum, a) => partialSum + a, 0) * 100
    ) / 100
  ).toFixed(2);

  function handleCheck(ingredientId) {
    !checkedArray.includes(ingredientId)
      ? setCheckedArray([...checkedArray, ingredientId])
      : setCheckedArray(
          checkedArray.filter((idInclude) => idInclude !== ingredientId)
        );
  }

  const nutritionInfo = async () => {
    try {
      await axios
        .get(`http://192.168.68.74:3000/nutrition/${recipe.recipe_id}`)
        .then((res) => setNutrition(res.data[0]));
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    nutritionInfo();
  }, []);

  return (
    <>
      <Container style={{ width: "100%" }} className="border shadow ">
        <Row>
          <Button
            variant="outline-primary"
            onClick={() => {
              navigate(-1);
            }}
          >
            {`< Back`}
          </Button>
        </Row>
        <Row>
          {" "}
          <CardImg
            src={recipe.img_url}
            style={{ width: "100%", height: "200px" }}
            className="object-fit-cover"
          />
        </Row>
        <Row className="pt-3">
          <Col>
            <h2>
              {recipe.name}{" "}
              <Link to={`/recipes/${recipe.recipe_id}/edit`}>
                <Button className="p-1">Edit Recipe</Button>
              </Link>
            </h2>
          </Col>
          <Col className="text-end">
            <a href={recipe.url}>Original Recipe</a>
          </Col>
        </Row>
        <Row>
          {" "}
          <Stack direction="horizontal" gap={1}>
            {recipe.cuisine.map((cuisine) => {
              return (
                <Badge bg="primary" key={cuisine.id}>
                  {cuisine.cuisine}
                </Badge>
              );
            })}

            {recipe.category.map((category) => {
              return (
                <Badge bg="primary" key={category.id}>
                  {category.category}
                </Badge>
              );
            })}
          </Stack>
        </Row>
        <Row>
          <Col>
            <ListGroup className="">
              <span className="h3"> Ingredients - ${recipePrice} </span>
              {recipe.ingredients.map((ingredient) => {
                return (
                  <div className="form-check" key={ingredient.id}>
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id={ingredient.id}
                      onClick={() => handleCheck(ingredient.id)}
                    />
                    <label
                      className={`form-check-label text-lowercase ${
                        checkedArray.includes(ingredient.id)
                          ? "text-decoration-line-through"
                          : ""
                      }`}
                      htmlFor={ingredient.id}
                    >
                      <div className="d-inline fw-semibold">{`${Math.round(
                        ingredient.amt * servs
                      )} grams`}</div>
                      {` ${ingredient.ingredient}`}{" "}
                      {`(${
                        Math.round(ingredient.engAmt * servs * 100) / 100 +
                        " " +
                        ingredient.engLabel
                      }) - $${(
                        Math.round(
                          ingredient.price * ingredient.amt * servs * 100
                        ) / 100
                      ).toFixed(2)}`}
                    </label>
                  </div>
                );
              })}
            </ListGroup>
          </Col>
          <Col>
            <ListGroup variant="flush">
              <span className="h3"> Directions </span>
              <ol>
                {recipe.directions.map((direction) => {
                  return (
                    <p key={direction.id}>
                      <li>{`${direction.step}`}</li>
                    </p>
                  );
                })}
              </ol>
            </ListGroup>
          </Col>
          <Col>
            <>
              <section className="performance-facts">
                <header className="performance-facts__header">
                  <h1 className="performance-facts__title">Nutrition Facts</h1>
                  <p>Serving Size 1/2 cup (about 82g)</p>
                  <p>
                    Servings per Recipe
                    <input
                      type="number"
                      id="servings"
                      min="0"
                      value={servings}
                      onChange={(event) => setServings(event.target.value)}
                      style={{ width: "3rem" }}
                      className="me-2"
                    />
                  </p>
                </header>
                <table className="performance-facts__table">
                  <thead>
                    <tr>
                      <th colSpan={3} className="small-info">
                        Amount Per Serving
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <th colSpan={2}>
                        <b>Calories</b>
                        {nutrition.kcal}
                      </th>
                      <td></td>
                    </tr>
                    <tr className="thick-row">
                      <td colSpan={3} className="small-info">
                        <b>% Daily Value*</b>
                      </td>
                    </tr>
                    <tr>
                      <th colSpan={2}>
                        <b>Total Fat</b>
                        {` ${nutrition.tot_fat}g`}
                      </th>
                      <td>
                        <b>{`${Math.round(nutrition.tot_fat / 0.65)}%`}</b>
                      </td>
                    </tr>
                    <tr>
                      <td className="blank-cell"></td>
                      <th>Saturated Fat {` ${nutrition.sat_fat}g`}</th>
                      <td>
                        <b>{` ${Math.round(nutrition.sat_fat / 0.2)}%`}</b>
                      </td>
                    </tr>
                    <tr>
                      <td className="blank-cell"></td>
                      <th>Trans Fat 0g</th>
                      <td></td>
                    </tr>
                    <tr>
                      <th colSpan={2}>
                        <b>Cholesterol</b>
                        {` ${nutrition.chol}mg`}
                      </th>
                      <td>
                        <b>{` ${Math.round(nutrition.chol / 3)}%`}</b>
                      </td>
                    </tr>
                    <tr>
                      <th colSpan={2}>
                        <b>Sodium</b>
                        {` ${nutrition.sodium}mg`}
                      </th>
                      <td>
                        <b>{` ${Math.round(nutrition.sodium / 24)}%`}</b>
                      </td>
                    </tr>
                    <tr>
                      <th colSpan={2}>
                        <b>Total Carbohydrate</b>
                        {` ${nutrition.carb}g`}
                      </th>
                      <td>
                        <b>{` ${Math.round(nutrition.carb / 3)}%`}</b>
                      </td>
                    </tr>
                    <tr>
                      <td className="blank-cell"></td>
                      <th>Dietary Fiber {` ${nutrition.fiber}g`}</th>
                      <td>
                        <b>{` ${nutrition.fiber / 0.25}%`}</b>
                      </td>
                    </tr>
                    <tr>
                      <td className="blank-cell"></td>
                      <th>Sugars {` ${nutrition.sugar}g`}</th>
                      <td></td>
                    </tr>
                    <tr className="thick-end">
                      <th colSpan={2}>
                        <b>Protein</b>
                        {` ${nutrition.protein}g`}
                      </th>
                      <td></td>
                    </tr>
                  </tbody>
                </table>
                <table className="performance-facts__table--grid">
                  <tbody>
                    <tr>
                      <td colSpan={2}>
                        Vitamin D {` ${Math.round(nutrition.vit_d / 0.15)}%`}
                      </td>
                      <td>
                        Vitamin C {` ${Math.round(nutrition.vit_c / 0.85)}%`}
                      </td>
                    </tr>
                    <tr className="thin-end">
                      <td colSpan={2}>
                        Calcium {` ${Math.round(nutrition.calcium / 10)}%`}
                      </td>
                      <td>Iron {` ${Math.round(nutrition.iron / 0.1)}%`}</td>
                    </tr>
                  </tbody>
                </table>
                <p className="small-info">
                  * Percent Daily Values are based on a 2,000 calorie diet. Your
                  daily values may be higher or lower depending on your calorie
                  needs:
                </p>
                <table className="performance-facts__table--small small-info">
                  <thead>
                    <tr>
                      <td colSpan={2} />
                      <th>Calories:</th>
                      <th>2,000</th>
                      <th>2,500</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <th colSpan={2}>Total Fat</th>
                      <td>Less than</td>
                      <td>65g</td>
                      <td>80g</td>
                    </tr>
                    <tr>
                      <td className="blank-cell" />
                      <th>Saturated Fat</th>
                      <td>Less than</td>
                      <td>20g</td>
                      <td>25g</td>
                    </tr>
                    <tr>
                      <th colSpan={2}>Cholesterol</th>
                      <td>Less than</td>
                      <td>300mg</td>
                      <td>300 mg</td>
                    </tr>
                    <tr>
                      <th colSpan={2}>Sodium</th>
                      <td>Less than</td>
                      <td>2,400mg</td>
                      <td>2,400mg</td>
                    </tr>
                    <tr>
                      <th colSpan={3}>Total Carbohydrate</th>
                      <td>300g</td>
                      <td>375g</td>
                    </tr>
                    <tr>
                      <td className="blank-cell" />
                      <th colSpan={2}>Dietary Fiber</th>
                      <td>25g</td>
                      <td>30g</td>
                    </tr>
                  </tbody>
                </table>
                <p className="small-info">Calories per gram:</p>
                <p className="small-info text-center">
                  Fat 9 • Carbohydrate 4 • Protein 4
                </p>
              </section>
            </>
          </Col>
        </Row>
      </Container>
    </>
  );
}
