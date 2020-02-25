import { DISPATCHES } from "./use-index-reducer";
import fetch from "isomorphic-unfetch";

const API_URL_BASE =
  process.env.NODE_ENV === "production"
    ? "/api"
    : "https://zfd3nwyhac.execute-api.us-east-1.amazonaws.com/production";

export default async function fetchAudio({ articleUrl, dispatch, voiceId }) {
  try {
    const httpOptions = {
      body: JSON.stringify({ articleUrl, voiceId }),
      headers: { "Content-Type": "application/json" },
      method: "POST"
    };

    const resArticle = await fetch(
      `${API_URL_BASE}/parse-website`,
      httpOptions
    );
    if (!resArticle.ok) throw new Error("Error parsing website.");
    const article = await resArticle.json();

    const resAudio = await fetch(
      `${API_URL_BASE}/website-to-audio`,
      httpOptions
    );
    if (!resAudio.ok) throw new Error("Error converting website to audio.");
    const audio = await resAudio.json();

    dispatch({
      payload: {
        article,
        audioUrl: audio.url,
        articleUrl: article.canonicalLink
      },
      type: DISPATCHES.AUDIO_FETCHED
    });
  } catch (err) {
    dispatch({ type: DISPATCHES.AUDIO_FETCH_ERROR });
  }
}
