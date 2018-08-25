const _get = require("lodash/get");
import fetch from "isomorphic-unfetch";
import querystring from "querystring";
import Head from "next/head";
import React from "react";
const ReactMarkdown = require("react-markdown");
import {
  Alert,
  Button,
  Container,
  Form,
  FormGroup,
  Input,
  Label
} from "reactstrap";

const ERROR_MESSAGE_DEFAULT = "An error occurred.";

class Index extends React.Component {
  state = {
    articleMarkdown: "",
    articleUrl: "",
    audioUrl: "",
    errorMessage: "",
    isLoading: false
  };

  handleArticleUrlChange = evt => {
    this.setState({ [evt.target.name]: evt.target.value });
  };

  handleSubmit = evt => {
    evt.preventDefault();

    let articleMarkdown = "";
    let audioUrl = "";
    let errorMessage = "";

    this.setState(
      { articleMarkdown, audioUrl, errorMessage, isLoading: true },
      async () => {
        if (this.state.articleUrl.trim().length === 0) {
          this.setState({ isLoading: false });
          return;
        }

        try {
          const httpOptions = {
            body: JSON.stringify({ url: this.state.articleUrl }),
            headers: { "Content-Type": "application/json" },
            method: "POST"
          };

          const articleJson = await (await fetch(
            "https://bf254ucpeg.execute-api.us-east-1.amazonaws.com/dev/convert-article-to-markdown",
            httpOptions
          )).json();

          const title = articleJson.title;
          const markdown = articleJson.markdown;

          if (markdown.trim().length) {
            articleMarkdown = `# ${title}\n${markdown}`;
          }

          audioUrl = (await (await fetch(
            "https://bf254ucpeg.execute-api.us-east-1.amazonaws.com/dev/convert-article-to-audio",
            httpOptions
          )).json()).url;
        } catch (err) {
          errorMessage = ERROR_MESSAGE_DEFAULT;
        }

        this.setState({
          articleMarkdown,
          audioUrl,
          errorMessage,
          isLoading: false
        });
      }
    );
  };

  render() {
    const errorComponent = this.state.errorMessage.length ? (
      <Alert color="danger">{this.state.errorMessage}</Alert>
    ) : null;

    const audioComponent = this.state.audioUrl.length ? (
      <div style={{ padding: "2rem 0", textAlign: "center" }}>
        <audio autoPlay controls src={this.state.audioUrl}>
          Your browser does not support the <code>audio</code> element.
        </audio>
      </div>
    ) : null;

    const articleComponent = this.state.articleMarkdown.length ? (
      <ReactMarkdown source={this.state.articleMarkdown} />
    ) : null;

    const buttonText = this.state.isLoading ? (
      <i className="fas fa-spinner fa-spin" />
    ) : (
      "Submit"
    );

    return (
      <Container>
        <div style={{ margin: "0 auto", paddingTop: "3%", width: "90%" }}>
          {errorComponent}
          <Form onSubmit={this.handleSubmit}>
            <FormGroup>
              <Label for="articleUrl">
                <strong>Enter an article URL:</strong>
              </Label>
              <Input
                id="articleUrl"
                name="articleUrl"
                onChange={this.handleArticleUrlChange}
                type="text"
                value={this.state.articleUrl}
              />
            </FormGroup>
            <FormGroup style={{ textAlign: "center" }}>
              <Button type="submit">{buttonText}</Button>
            </FormGroup>
          </Form>
          {audioComponent}
          {articleComponent}
        </div>
      </Container>
    );
  }
}

export default Index;
