import _isEmpty from "lodash/isEmpty";
import _get from "lodash/get";
import fetch from "isomorphic-unfetch";
import Article from "../components/article";
import ArticleUrlForm from "../components/article-url-form";
import AudioSpeed from "../components/audio-speed";
import Error from "../components/error";
import Head from "next/head";
import Link from "next/link";
import React from "react";
import { Col, Container, Row } from "reactstrap";
import { parseQueryString } from "../lib/url";
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

  componentDidMount() {
    const newState = parseQueryString();

    if (!_isEmpty(newState)) {
      this.setState(newState, () => {
        if (this.state.articleUrl) {
          this.onSubmit({ preventDefault: () => {} });
        }
      });
    }
  }

  onArticleUrlChange = evt => {
    this.setState({ [evt.target.name]: evt.target.value });
  };

  onAudioSpeedChange = value => {
    const audioSpeed = Math.round(value * 100) / 100;

    this.setState({ audioSpeed }, () => {
      const query = parseQueryString();

      this.props.router.push("/", { query: { ...query, audioSpeed } });

      this.refs.audio.playbackRate = audioSpeed;
    });
  };

  onSubmit = evt => {
    evt.preventDefault();

    let articleText = "";
    let articleTitle = "";
    let audioUrl = "";
    let errorMessage = "";

    this.setState(
      { articleText, articleTitle, audioUrl, errorMessage, isLoading: true },
      async () => {
        const articleUrl = this.state.articleUrl;
        const query = parseQueryString();
        this.props.router.push("/", {
          query: { ...query, articleUrl, voiceId: this.state.voiceId }
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

  onVoiceIDChange = evt => {
    this.setState({ voiceId: evt.target.value });
  };

  render() {
    const audioComponent = _isEmpty(this.state.audioUrl) ? null : (
      <audio autoPlay controls ref="audio" src={this.state.audioUrl}>
        Your browser does not support the <code>audio</code> element.
      </audio>
    );

    const submitButtonText = this.state.isLoading ? (
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
          <Error text={this.state.errorMessage} />
          <ArticleUrlForm
            articleUrl={this.state.articleUrl}
            onArticleUrlChange={this.onArticleUrlChange}
            onSubmit={this.onSubmit}
            onVoiceIDChange={this.onVoiceIDChange}
            submitButtonText={submitButtonText}
            voiceId={this.state.voiceId}
          />
          <Row style={{ padding: "2rem 0" }}>
            <Col sm="6" style={{ textAlign: "center" }}>
              {audioComponent}
            </Col>
            <Col sm="6">
              <AudioSpeed
                onChange={this.onAudioSpeedChange}
                show={!_isEmpty(this.state.audioUrl)}
                value={this.state.audioSpeed}
              />
            </Col>
          </Row>
        </Container>
        <Article article={this.state.article} />
      </div>
    );
  }
}

export default withRouter(Index);
