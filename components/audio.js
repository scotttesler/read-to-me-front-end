import _get from "lodash/get";
import AudioSpeed from "./audio-speed";
import PropTypes from "prop-types";
import React from "react";
import { Button, ButtonGroup, Col, Container, Row } from "reactstrap";

class Audio extends React.Component {
  DEFAULT_SKIP_SECONDS = 10;

  componentDidMount() {
    this.refs.audio.playbackRate = this.props.audioSpeed;
  }

  componentDidUpdate(prevProps) {
    if (this.props.audioSpeed !== prevProps.audioSpeed) {
      this.refs.audio.playbackRate = this.props.audioSpeed;
    }
  }

  onBackSpeedButtonClick = () => {
    this.refs.audio.currentTime -= this.getSkipSeconds();
  };

  onForwardSpeedButtonClick = () => {
    this.refs.audio.currentTime += this.getSkipSeconds();
  };

  getSkipSeconds = () => {
    return _get(this, "props.skipSeconds", this.DEFAULT_SKIP_SECONDS);
  };

  render() {
    const skipSeconds = this.getSkipSeconds();

    return (
      <div style={{ background: "white", position: "sticky", top: "0px" }}>
        <Row style={{ padding: "2rem 0" }}>
          <Col md="4" style={{ textAlign: "center" }}>
            <audio autoPlay controls ref="audio" src={this.props.audioUrl}>
              Your browser does not support the <code>audio</code> element.
            </audio>
          </Col>
          <Col className="xs-margin-bottom" md="4" style={{ textAlign: "center" }}>
            <ButtonGroup>
              <Button color="info" onClick={this.onBackSpeedButtonClick}>
                <i className="fas fa-undo" /> {skipSeconds}s
              </Button>
              <Button color="info" onClick={this.onForwardSpeedButtonClick}>
                <i className="fas fa-redo" /> {skipSeconds}s
              </Button>
            </ButtonGroup>
          </Col>
          <Col md="4">
            <AudioSpeed
              onChange={this.props.onAudioSpeedChange}
              value={this.props.audioSpeed}
            />
          </Col>
        </Row>
      </div>
    );
  }
}

Audio.propTypes = {
  skipSeconds: PropTypes.number
};

export default Audio;
