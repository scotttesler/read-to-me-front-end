import _isEmpty from "lodash/isEmpty";
import _get from "lodash/get";
import fetch from "isomorphic-unfetch";
import Head from "next/head";
import InputRange from "react-input-range";
import Link from "next/link";
import React from "react";
import {
  Alert,
  Button,
  Col,
  Container,
  Form,
  FormGroup,
  Input,
  Label,
  Row
} from "reactstrap";
import { withRouter } from "next/router";

const API_URL_BASE =
  "https://zfd3nwyhac.execute-api.us-east-1.amazonaws.com/production";
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
      <audio autoPlay controls ref="audio" src={this.state.audioUrl}>
        Your browser does not support the <code>audio</code> element.
      </audio>
    ) : null;

    const audioSpeedComponent = this.state.audioUrl.length ? (
      <div style={{ margin: "0 auto", width: "280px" }}>
        <div>Audio speed</div>
        <InputRange
          maxValue={3}
          minValue={0}
          onChange={this.handleAudioSpeedChange}
          step={0.1}
          value={this.state.audioSpeed}
        />
      </div>
    ) : null;

    const articleImage = _get(article, "image", "").length ? (
      <img alt="Article image" src={article.image} style={{ width: "100%" }} />
    ) : null;

    const authors = _get(article, "author.0", "");
    const authorComponent =
      authors.length && !authors.includes("{{") ? (
        <div style={{ textAlign: "center" }}>
          by{" "}
          <span style={{ fontStyle: "italic" }}>
            {article.author.join(", ")}
          </span>
        </div>
      ) : null;
    const articleComponent = !_isEmpty(article) ? (
      <React.Fragment>
        <h1 style={{ paddingTop: "1rem", textAlign: "center" }}>
          {article.title}
        </h1>
        {authorComponent}
        <p style={{ padding: "2rem 0", whiteSpace: "pre-wrap" }}>
          {article.text}
        </p>
      </React.Fragment>
    ) : null;

    const buttonText = this.state.isLoading ? (
      <i className="fas fa-spinner fa-spin" />
    ) : (
      "Submit"
    );

    return (
      <div>
        <Container>
          <h1 style={{ padding: "2rem 0 4rem 0", textAlign: "center" }}>
            ReadToMe
          </h1>
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
          <Row style={{ padding: "2rem 0" }}>
            <Col sm="6" style={{ textAlign: "center" }}>
              {audioComponent}
            </Col>
            <Col sm="6">{audioSpeedComponent}</Col>
          </Row>
        </Container>
        {articleImage}
        <Container>
          {articleComponent}
          <p style={{ padding: "2rem 0 0 0", textAlign: "center" }}>
            Built with{" "}
            <span style={{ color: "red", fontSize: "1.2rem" }}>♥</span> by{" "}
            <a href="https://github.com/scotttesler" target="_href">
              Scott Tesler
            </a>
          </p>
          <style global jsx>{`
            .input-range__slider {
              appearance: none;
              background: #3f51b5;
              border: 1px solid #3f51b5;
              border-radius: 100%;
              cursor: pointer;
              display: block;
              height: 1rem;
              margin-left: -0.5rem;
              margin-top: -0.65rem;
              outline: none;
              position: absolute;
              top: 50%;
              transition: transform 0.3s ease-out, box-shadow 0.3s ease-out;
              width: 1rem;
            }
            .input-range__slider:active {
              transform: scale(1.3);
            }
            .input-range__slider:focus {
              box-shadow: 0 0 0 5px rgba(63, 81, 181, 0.2);
            }
            .input-range--disabled .input-range__slider {
              background: #cccccc;
              border: 1px solid #cccccc;
              box-shadow: none;
              transform: none;
            }

            .input-range__slider-container {
              transition: left 0.3s ease-out;
            }

            .input-range__label {
              color: #aaaaaa;
              font-family: "Helvetica Neue", san-serif;
              font-size: 0.8rem;
              transform: translateZ(0);
              white-space: nowrap;
            }

            .input-range__label--min,
            .input-range__label--max {
              bottom: -1.4rem;
              position: absolute;
            }

            .input-range__label--min {
              left: 0;
            }

            .input-range__label--max {
              right: 0;
            }

            .input-range__label--value {
              position: absolute;
              top: -1.8rem;
            }

            .input-range__label-container {
              left: -50%;
              position: relative;
            }
            .input-range__label--max .input-range__label-container {
              left: 50%;
            }

            .input-range__track {
              background: #eeeeee;
              border-radius: 0.3rem;
              cursor: pointer;
              display: block;
              height: 0.3rem;
              position: relative;
              transition: left 0.3s ease-out, width 0.3s ease-out;
            }
            .input-range--disabled .input-range__track {
              background: #eeeeee;
            }

            .input-range__track--background {
              left: 0;
              margin-top: -0.15rem;
              position: absolute;
              right: 0;
              top: 50%;
            }

            .input-range__track--active {
              background: #3f51b5;
            }

            .input-range {
              height: 1rem;
              position: relative;
              width: 100%;
            }
          `}</style>
        </Container>
      </div>
    );
  }
}

export default withRouter(Index);
