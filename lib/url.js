import _isEmpty from "lodash/isEmpty";

export const parseQueryString = (queryString = window.location.search) => {
  const parsedQueryString = {};
  const searchParams = new URLSearchParams(queryString);

  for (let p of searchParams) {
    if (!_isEmpty(p[1])) parsedQueryString[p[0]] = p[1];
  }

  return parsedQueryString;
};
