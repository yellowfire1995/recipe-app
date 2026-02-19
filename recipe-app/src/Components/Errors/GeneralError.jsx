export function GeneralError({ error }) {
  return (
    <div id="error-page">
      <h1>Oops!</h1>
      <p>Sorry, an unexpected error has occurred.</p>
      <p>
        <i>
          {error.status} {error.statusText}
        </i>
      </p>
    </div>
  );
}
