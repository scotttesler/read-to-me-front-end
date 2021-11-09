import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { useEffect } from "react";
import { useRouter } from "next/router";
import { Container } from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import _isEmpty from "lodash/isEmpty";
import _omit from "lodash/omit";
import fetchAudio from "../lib/fetch-audio";
import parseQueryString from "../lib/parse-query-string";
import useIndexReducer, {
  DISPATCHES,
  INIT_STATE,
} from "../lib/use-index-reducer";
import Article from "../components/article";
import ArticleUrlForm from "../components/article-url-form";
import Audio from "../components/audio";
import Error from "../components/error";
import Footer from "../components/footer";

export default function Index() {
  const router = useRouter();
  const [
    {
      article,
      articleUrl,
      audioSpeed,
      audioUrl,
      errorMessage,
      isLoading,
      voiceId,
    },
    dispatch,
  ] = useIndexReducer();

  useEffect(() => {
    if (audioSpeed === INIT_STATE.audioSpeed) {
      router.push({
        pathname: "/",
        query: _omit(parseQueryString(), ["audioSpeed"]),
      });
      return;
    }

    router.push({
      pathname: "/",
      query: { ...parseQueryString(), audioSpeed },
    });
  }, [audioSpeed]);

  useEffect(() => {
    if (!isLoading) return;

    if (articleUrl === INIT_STATE.articleUrl) {
      router.push({
        pathname: "/",
        query: _omit(parseQueryString(), ["articleUrl", "voiceId"]),
      });
      dispatch({ payload: false, type: DISPATCHES.SET_IS_LOADING });
      return;
    }

    router.push({
      pathname: "/",
      query: { ...parseQueryString(), articleUrl, voiceId },
    });

    fetchAudio({ articleUrl, dispatch, voiceId });
  }, [isLoading]);

  function onArticleUrlChange(evt) {
    dispatch({ payload: evt.target.value, type: DISPATCHES.SET_ARTICLE_URL });
  }

  function onAudioSpeedChange(val) {
    dispatch({
      payload: Math.round(val * 100) / 100,
      type: DISPATCHES.SET_AUDIO_SPEED,
    });
  }

  function onSubmit(evt) {
    evt.preventDefault();
    dispatch({ type: DISPATCHES.SUBMIT });
  }

  function onVoiceIdChange(evt) {
    dispatch({ payload: evt.target.value, type: DISPATCHES.SET_VOICE_ID });
  }

  return (
    <>
      <Container>
        <h1 style={{ padding: "2rem 0 4rem 0", textAlign: "center" }}>
          ReadToMe
        </h1>
        <Error text={errorMessage} />
        <ArticleUrlForm
          articleUrl={articleUrl}
          onArticleUrlChange={onArticleUrlChange}
          onSubmit={onSubmit}
          onVoiceIdChange={onVoiceIdChange}
          submitButtonText={
            isLoading ? <FontAwesomeIcon icon={faSpinner} spin /> : "Submit"
          }
          voiceId={voiceId}
        />
      </Container>

      {_isEmpty(audioUrl) ? null : (
        <Audio
          articleImage={article?.image ?? ""}
          articlePublisher={article?.publisher ?? ""}
          articleTitle={article?.title ?? ""}
          audioSpeed={audioSpeed}
          audioUrl={audioUrl}
          onAudioSpeedChange={onAudioSpeedChange}
        />
      )}

      <Article article={article} />
      <Footer />
    </>
  );
}
