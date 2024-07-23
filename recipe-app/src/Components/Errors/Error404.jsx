export function Error404({ error }) {
  return (
    <>
      <h1>{error.status}!</h1>
      <p>Sorry, you have attempted to access something that does not exist.</p>
    </>
  );
}
