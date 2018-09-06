import _isEmpty from "lodash/isEmpty";
import { Alert } from "reactstrap";

export default ({ text }) => {
  if (_isEmpty(text)) return null;

  return <Alert color="danger">{text}</Alert>;
};
