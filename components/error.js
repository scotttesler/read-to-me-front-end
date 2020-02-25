import { Alert } from "reactstrap";
import _isEmpty from "lodash/isEmpty";

export default function Error({ text = "" }) {
  if (_isEmpty(text)) return null;

  return <Alert color="danger">{text}</Alert>;
}
