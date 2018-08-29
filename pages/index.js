import _get from "lodash/get";
import fetch from "isomorphic-unfetch";
import querystring from "querystring";
import Head from "next/head";
import Link from "next/link";
import React from "react";
import ReactMarkdown from "react-markdown";
import Slider from "react-rangeslider";
import {
  Alert,
  Button,
  Container,
  Form,
  FormGroup,
  Input,
  Label
} from "reactstrap";
import { withRouter } from "next/router";

const API_URL_BASE =
  "https://bf254ucpeg.execute-api.us-east-1.amazonaws.com/dev";
const DEFAULT_ERROR_MESSAGE = "The article could not be parsed.";
const DEFAULT_VOICE_ID = "Matthew";

class Index extends React.Component {
  state = {
    articleMarkdown: "",
    articleUrl: "",
    audioSpeed: 1,
    audioUrl: "",
    errorMessage: "",
    isLoading: false,
    voiceId: DEFAULT_VOICE_ID
  };

  componentDidMount() {
    const urlParams = new URLSearchParams(window.location.search);

    if (urlParams.has("articleUrl")) {
      this.setState({ articleUrl: urlParams.get("articleUrl") }, () => {
        this.handleSubmit({ preventDefault: () => {} });
      });
    }
  }

  handleArticleUrlChange = evt => {
    this.setState({ [evt.target.name]: evt.target.value });
  };

  handleAudioSpeedChange = value => {
    const audioSpeed = Math.round(value * 100) / 100;
    this.setState({ audioSpeed: audioSpeed }, () => {
      this.refs.audio.playbackRate = audioSpeed;
    });
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
            body: JSON.stringify({
              articleUrl: this.state.articleUrl,
              voiceId: this.state.voiceId
            }),
            headers: { "Content-Type": "application/json" },
            method: "POST"
          };

          const articleJson = await (await fetch(
            `${API_URL_BASE}/convert-article-to-markdown`,
            httpOptions
          )).json();

          const title = articleJson.title;
          const markdown = articleJson.markdown;

          if (markdown.trim().length) {
            articleMarkdown = `# ${title}\n${markdown}`;
          }

          audioUrl = (await (await fetch(
            `${API_URL_BASE}/convert-article-to-audio`,
            httpOptions
          )).json()).url;

          this.props.router.replace({
            pathname: "/",
            query: { articleUrl: this.state.articleUrl }
          });
        } catch (err) {
          errorMessage = DEFAULT_ERROR_MESSAGE;
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

  handleVoiceIDChange = evt => {
    this.setState({ voiceId: evt.target.value });
  };

  render() {
    const errorComponent = this.state.errorMessage.length ? (
      <Alert color="danger">{this.state.errorMessage}</Alert>
    ) : null;

    const audioComponent = this.state.audioUrl.length ? (
      <div style={{ padding: "2rem 0", textAlign: "center" }}>
        <audio autoPlay controls ref="audio" src={this.state.audioUrl}>
          Your browser does not support the <code>audio</code> element.
        </audio>
      </div>
    ) : null;

    const audioSpeedComponent = this.state.audioUrl.length ? (
      <div>
        <span>
          <strong>Audio speed:</strong>
        </span>
        <Slider
          max={3}
          onChange={this.handleAudioSpeedChange}
          step={0.1}
          value={this.state.audioSpeed}
        />
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
            <FormGroup>
              <Label for="voiceIdSelect">
                <strong>Voice</strong>
              </Label>
              <Input
                id="voiceIdSelect"
                name="select"
                onChange={this.handleVoiceIDChange}
                type="select"
                value={this.state.voiceId}
              >
                <option value="Matthew">Matthew (US)</option>
                <option value="Joey">Joey (US)</option>
                <option value="Justin">Justin (US)</option>
                <option value="Ivy">Ivy (US)</option>
                <option value="Joanna">Joanna (US)</option>
                <option value="Kendra">Kendra (US)</option>
                <option value="Kimberly">Kimberly (US)</option>
                <option value="Salli">Salli (US)</option>
                <option value="Brian">Brian (British)</option>
                <option value="Amy">Amy (British)</option>
                <option value="Emma">Emma (British)</option>
                <option value="Russell">Russell (AU)</option>
                <option value="Nicole">Nicole (AU)</option>
                <option value="Geraint">Geraint (Welsh)</option>
                <option value="Aditi">Aditi (Indian)</option>
                <option value="Raveena">Raveena (Indian)</option>
              </Input>
            </FormGroup>
            <FormGroup style={{ textAlign: "center" }}>
              <Button type="submit">{buttonText}</Button>
            </FormGroup>
          </Form>
          {audioComponent}
          {audioSpeedComponent}
          {articleComponent}
        </div>
      </Container>
    );
  }
}

export default withRouter(Index);
