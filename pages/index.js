import _isEmpty from "lodash/isEmpty";
import fetch from "isomorphic-unfetch";
import Head from "next/head";
import Link from "next/link";
import React from "react";
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
  "https://p8gwj6kna0.execute-api.us-east-1.amazonaws.com/production";
const DEFAULT_ERROR_MESSAGE = "The article could not be parsed.";
const DEFAULT_VOICE_ID = "Matthew";

class Index extends React.Component {
  state = {
    article: {},
    articleUrl: "",
    audioSpeed: 1,
    audioUrl: "",
    errorMessage: "",
    isLoading: false,
    voiceId: DEFAULT_VOICE_ID
  };

  parseQueryString(queryString = window.location.search) {
    const parsedQueryString = {};
    const searchParams = new URLSearchParams(queryString);

    for (let p of searchParams) {
      if (!_isEmpty(p[1])) parsedQueryString[p[0]] = p[1];
    }

    return parsedQueryString;
  }

  componentDidMount() {
    const newState = this.parseQueryString();

    if (!_isEmpty(newState)) {
      this.setState(newState, () => {
        if (this.state.articleUrl) {
          this.handleSubmit({ preventDefault: () => {} });
        }
      });
    }
  }

  handleArticleUrlChange = evt => {
    this.setState({ [evt.target.name]: evt.target.value });
  };

  handleAudioSpeedChange = value => {
    const audioSpeed = Math.round(value * 100) / 100;

    this.setState({ audioSpeed: audioSpeed }, () => {
      const query = this.parseQueryString();

      this.props.router.replace("/", {
        query: { ...query, audioSpeed }
      });

      this.refs.audio.playbackRate = audioSpeed;
    });
  };

  handleSubmit = evt => {
    evt.preventDefault();

    let articleText = "";
    let articleTitle = "";
    let audioUrl = "";
    let errorMessage = "";

    this.setState(
      {
        articleText,
        articleTitle,
        audioUrl,
        errorMessage,
        isLoading: true
      },
      async () => {
        const articleUrl = this.state.articleUrl;
        const query = this.parseQueryString();
        this.props.router.replace("/", {
          query: {
            ...query,
            articleUrl,
            voiceId: this.state.voiceId
          }
        });

        if (_isEmpty(articleUrl)) {
          this.setState({ isLoading: false });
          return;
        }

        try {
          const httpOptions = {
            body: JSON.stringify({ articleUrl, voiceId: this.state.voiceId }),
            headers: { "Content-Type": "application/json" },
            method: "POST"
          };

          let res = await fetch(`${API_URL_BASE}/parse-website`, httpOptions);
          if (!res.ok) throw new Error("Erroring parsing website.");
          const article = await res.json();

          res = await fetch(`${API_URL_BASE}/website-to-audio`, httpOptions);
          if (!res.ok) throw new Error("Erroring converting website to audio.");
          audioUrl = (await res.json()).url;

          this.setState(
            {
              article,
              audioUrl,
              articleUrl: article.canonicalLink,
              isLoading: false
            },
            () => {
              this.refs.audio.playbackRate = this.state.audioSpeed;
            }
          );
        } catch (err) {
          console.error(err);
          this.setState({
            errorMessage: DEFAULT_ERROR_MESSAGE,
            isLoading: false
          });
        }
      }
    );
  };

  handleVoiceIDChange = evt => {
    this.setState({ voiceId: evt.target.value });
  };

  render() {
    const article = this.state.article;

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
          value={Number(this.state.audioSpeed)}
        />
      </div>
    ) : null;

    const articleComponent = !_isEmpty(article) ? (
      <React.Fragment>
        <h1>{article.title}</h1>
        <img
          alt="Article image"
          src={article.image}
          style={{ width: "100%" }}
        />
        <strong>by {article.author.join(", ")}</strong>
        <p style={{ whiteSpace: "pre-wrap" }}>{article.text}</p>
      </React.Fragment>
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
