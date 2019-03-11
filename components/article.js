import _get from "lodash/get";
import _isEmpty from "lodash/isEmpty";
import { Container } from "reactstrap";

export default ({ article }) => {
  const articleImage = _isEmpty(_get(article, "image", "")) ? null : (
    <img alt="Article image" src={article.image} style={{ width: "100%" }} />
  );

  const publisher = _get(article, "publisher", "");

  const authorComponent =
    _isEmpty(publisher) ? null : (
      <div style={{ textAlign: "center" }}>
        by{" "}
        <span style={{ fontStyle: "italic" }}>{publisher}</span>
      </div>
    );

  const articleComponent = _isEmpty(article) ? null : (
    <>
      <h1 style={{ paddingTop: "1rem", textAlign: "center" }}>
        {article.title}
      </h1>
      {authorComponent}
      <p style={{ padding: "2rem 0", whiteSpace: "pre-wrap" }}>
        {article.text}
      </p>
    </>
  );

  return (
    <div>
      {articleImage}
      <Container>
        {articleComponent}
        <p style={{ padding: "2rem 0 0 0", textAlign: "center" }}>
          Built with <span style={{ color: "red", fontSize: "1.1rem" }}>♥</span>{" "}
          by{" "}
          <a href="https://github.com/scotttesler" target="_href">
            Scott Tesler
          </a>
        </p>
      </Container>
    </div>
  );
};
