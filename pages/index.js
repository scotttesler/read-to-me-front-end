import _isEmpty from "lodash/isEmpty";
import fetch from "isomorphic-unfetch";
import Article from "../components/article";
import ArticleUrlForm from "../components/article-url-form";
import Audio from "../components/audio";
import Error from "../components/error";
import Head from "next/head";
import Link from "next/link";
import React from "react";
import { parseQueryString } from "../lib/url";
import { withRouter } from "next/router";
import { Container } from "reactstrap";

const API_URL_BASE = "/api";
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

          this.setState({
            article,
            audioUrl,
            articleUrl: article.canonicalLink,
            isLoading: false
          });
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
      <Audio
        audioSpeed={this.state.audioSpeed}
        audioUrl={this.state.audioUrl}
        onAudioSpeedChange={this.onAudioSpeedChange}
      />
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
        </Container>

        {audioComponent}
        <Article article={this.state.article} />
      </div>
    );
  }
}

export default withRouter(Index);
