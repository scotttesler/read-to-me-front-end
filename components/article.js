import { Container } from "reactstrap";
import _isEmpty from "lodash/isEmpty";

export default function Article({ article = {} }) {
  const articleImage = _isEmpty(article?.image ?? "") ? null : (
    <img alt="Article image" src={article.image} style={{ width: "100%" }} />
  );

  const publisher = article?.publisher ?? "";

  const authorComponent = _isEmpty(publisher) ? null : (
    <div style={{ textAlign: "center" }}>
      by <span style={{ fontStyle: "italic" }}>{publisher}</span>
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
      <Container>{articleComponent}</Container>
    </div>
  );
}
