import { Button, Form, FormGroup, Input, Label } from "reactstrap";

export default function ArticleUrlForm({
  articleUrl = "",
  onArticleUrlChange = () => {},
  onSubmit = () => {},
  onVoiceIdChange = () => {},
  submitButtonText = "",
  voiceId = ""
}) {
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
          onChange={onVoiceIdChange}
          type="select"
          value={voiceId}
        >
          <option value="Matthew">Man (American)</option>
          <option value="Brian">Man (English)</option>
          <option value="Russell">Man (Australian)</option>
          <option value="Geraint">Man (Welsh)</option>
          <option disabled>──────────</option>
          <option value="Kendra">Woman (American)</option>
          <option value="Amy">Woman (English)</option>
          <option value="Nicole">Woman (Australian)</option>
          <option value="Raveena">Woman 1 (Indian)</option>
          <option value="Aditi">Woman 2 (Indian)</option>
          <option disabled>──────────</option>
          <option value="Justin">Boy (American)</option>
          <option value="Salli">Teen Girl (American)</option>
          <option value="Ivy">Young Girl (American)</option>
        </Input>
      </FormGroup>

      <FormGroup style={{ textAlign: "center" }}>
        <Button type="submit">{submitButtonText}</Button>
      </FormGroup>
    </Form>
  );
}
