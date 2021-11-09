import { useReducer } from "react";
import parseQueryString from "./parse-query-string";

const DEFAULT_ERROR_MESSAGE = "The article could not be parsed.";

export const DISPATCHES = {
  AUDIO_FETCH_ERROR: "audio_fetch_error",
  AUDIO_FETCHED: "audio_fetched",
  SET_ARTICLE_URL: "set_article_url",
  SET_AUDIO_SPEED: "set_audio_speed",
  SET_IS_LOADING: "set_is_loading",
  SET_VOICE_ID: "set_voice_id",
  SUBMIT: "submit",
};

export const INIT_STATE = {
  article: {},
  articleTitle: "",
  articleUrl: "",
  audioSpeed: 1,
  audioUrl: "",
  errorMessage: "",
  isLoading: false,
  voiceId: "Matthew",
};

function init(state = {}) {
  const qs = parseQueryString();

  if ("articleUrl" in qs) return { ...state, ...qs, isLoading: true };

  return { ...state, ...qs };
}

function reducer(state = {}, action = {}) {
  switch (action.type) {
    case DISPATCHES.AUDIO_FETCH_ERROR:
      return {
        ...state,
        errorMessage: DEFAULT_ERROR_MESSAGE,
        isLoading: false,
      };
    case DISPATCHES.AUDIO_FETCHED:
      return { ...state, ...action.payload, isLoading: false };
    case DISPATCHES.SET_ARTICLE_URL:
      return { ...state, articleUrl: action.payload };
    case DISPATCHES.SET_AUDIO_SPEED:
      return { ...state, audioSpeed: action.payload };
    case DISPATCHES.SET_IS_LOADING:
      return { ...state, isLoading: action.payload };
    case DISPATCHES.SET_VOICE_ID:
      return { ...state, voiceId: action.payload };
    case DISPATCHES.SUBMIT:
      return {
        ...state,
        articleTitle: INIT_STATE.articleTitle,
        audioUrl: INIT_STATE.audioUrl,
        errorMessage: INIT_STATE.errorMessage,
        isLoading: true,
      };
    default:
      throw new Error("Invalid dispatch.");
  }
}

export default () => useReducer(reducer, INIT_STATE, init);
