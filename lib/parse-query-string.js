import _isEmpty from "lodash/isEmpty";
import queryString from "query-string";

export default function parseQueryString() {
  try {
    return queryString.parse(window.location.search, {
      parseBooleans: true,
      parseNumbers: true,
    });
  } catch (e) {
    return {};
  }
}
