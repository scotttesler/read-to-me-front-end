import { Button, Form, FormGroup, Input, Label } from "reactstrap";

export default ({
  articleUrl,
  onArticleUrlChange,
  onSubmit,
  onVoiceIDChange,
  submitButtonText,
  voiceId
}) => {
  return (
    <Form onSubmit={onSubmit}>
      <FormGroup>
        <Label for="articleUrl">
          <strong>Enter an article URL:</strong>
        </Label>
        <Input
          id="articleUrl"
          name="articleUrl"
          onChange={onArticleUrlChange}
          type="text"
          value={articleUrl}
        />
      </FormGroup>
      <FormGroup>
        <Label for="voiceIdSelect">
          <strong>Voice</strong>
        </Label>
        <Input
          id="voiceIdSelect"
          name="select"
          onChange={onVoiceIDChange}
          type="select"
          value={voiceId}
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
        <Button type="submit">{submitButtonText}</Button>
      </FormGroup>
    </Form>
  );
};
