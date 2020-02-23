import { faRedo, faUndo } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useRef } from "react";
import { Button, ButtonGroup, Col, Container, Row } from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import AudioSpeed from "./audio-speed";

export default function Audio({
  articleImage = "",
  articlePublisher = "",
  articleTitle = "",
  audioSpeed = 1,
  audioUrl = "",
  onAudioSpeedChange = () => {},
  skipSeconds = 10
}) {
  const refAudio = useRef(null);

  useEffect(() => setMediaSession(), []);
  useEffect(() => {
    refAudio.current.playbackRate = audioSpeed;
  }, [audioSpeed]);

  function handleBackSpeedButtonClick() {
    refAudio.current.currentTime -= skipSeconds;
  }

  function handleForwardSpeedButtonClick() {
    refAudio.current.currentTime += skipSeconds;
  }

  function setMediaSession() {
    if (!("mediaSession" in navigator)) return;

    navigator.mediaSession.metadata = new MediaMetadata({
      title: articleTitle,
      artist: articlePublisher,
      artwork: [{ src: articleImage }]
    });

    navigator.mediaSession.setActionHandler(
      "seekbackward",
      handleBackSpeedButtonClick
    );
    navigator.mediaSession.setActionHandler(
      "seekforward",
      handleForwardSpeedButtonClick
    );
  }

  return (
    <div style={{ background: "white", position: "sticky", top: "0px" }}>
      <Row style={{ padding: "2rem 0" }}>
        <Col md="4" style={{ textAlign: "center" }}>
          <audio autoPlay controls ref={refAudio} src={audioUrl}>
            Your browser does not support the <code>audio</code> element.
          </audio>
        </Col>
        <Col
          className="xs-margin-bottom"
          md="4"
          style={{ textAlign: "center" }}
        >
          <ButtonGroup>
            <Button color="info" onClick={handleBackSpeedButtonClick}>
              <FontAwesomeIcon icon={faUndo} /> {skipSeconds}s
            </Button>
            <Button color="info" onClick={handleForwardSpeedButtonClick}>
              <FontAwesomeIcon icon={faRedo} /> {skipSeconds}s
            </Button>
          </ButtonGroup>
        </Col>
        <Col md="4">
          <AudioSpeed onChange={onAudioSpeedChange} value={audioSpeed} />
        </Col>
      </Row>
    </div>
  );
}
