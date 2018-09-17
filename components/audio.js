import AudioSpeed from "./audio-speed";
import React from "react";
import { Col, Container, Row } from "reactstrap";

class Audio extends React.Component {
  componentDidMount() {
    this.refs.audio.playbackRate = this.props.audioSpeed;
  }

  componentDidUpdate(prevProps) {
    if (this.props.audioSpeed !== prevProps.audioSpeed) {
      this.refs.audio.playbackRate = this.props.audioSpeed;
    }
  }

  render() {
    return (
      <div style={{ background: "white", position: "sticky", top: "0px" }}>
        <Row style={{ padding: "2rem 0" }}>
          <Col md="6" style={{ textAlign: "center" }}>
            <audio autoPlay controls ref="audio" src={this.props.audioUrl}>
              Your browser does not support the <code>audio</code> element.
            </audio>
          </Col>
          <Col md="6">
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

export default Audio;
