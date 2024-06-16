import Container from "react-bootstrap/esm/Container";

export default function ErrorHandler(props) {
  const error = props.error;
  const status = error.response.status;
  console.log(error.response.status);

  if (status === 404)
    return (
      <Container className="justify-content-center">
        <h1>{status}!</h1>
        <p>Your request was not found. Please try again.</p>
        <p>
          <i></i>
        </p>
      </Container>
    );
}
