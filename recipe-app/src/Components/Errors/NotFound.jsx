import logger from "../../utils/logger";

export default function ErrorHandler({ error }) {
  logger.log(error);

  return <div className="error">Error!</div>;
}
