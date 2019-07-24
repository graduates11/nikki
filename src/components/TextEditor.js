import { EditorState, ContentState } from "draft-js";
import Editor from "draft-js-plugins-editor";
import createHashtagPlugin from "draft-js-hashtag-plugin";
import createInlineToolbarPlugin from "draft-js-inline-toolbar-plugin";
import createLinkPlugin from "draft-js-anchor-plugin";
import { ItalicButton, BoldButton, UnderlineButton } from "draft-js-buttons";
import React from "react";
import { Button, Input } from "reactstrap";

// Creates an Instance. At this step, a configuration object can be passed in
// as an argument.
const hashtagPlugin = createHashtagPlugin();
const inlineToolbarPlugin = createInlineToolbarPlugin();
const linkPlugin = createLinkPlugin();
const { InlineToolbar } = inlineToolbarPlugin;
const plugins = [hashtagPlugin, inlineToolbarPlugin, linkPlugin];

const sampleEntry = {
  id: "EfmidzPin",
  title: "Necessitatibus eos in saepe eaque rerum inventore quidem.",
  text:
    "Et quo corporis illo laborum ullam voluptate blanditiis assumenda molestias. Inventore assumenda dolor et officiis. Aut aliquid temporibus enim qui hic dolor sed. Minus atque qui molestiae eius rerum in adipisci perspiciatis aliquam.",
  date: "16.07.2019",
  tags: [1, 3, 5],
  attachments: ["http://lorempixel.com/640/480"]
};

class TextEditor extends React.Component {
  state = {
    entry: sampleEntry,
    editorState: EditorState.createWithContent(
      ContentState.createFromText(sampleEntry.text)
    )
  };

  onChange = editorState => {
    this.setState({
      editorState
    });
  };

  onTitleChange = e => {
    this.setState({
      entry: { ...this.state.entry, title: e.target.value }
    });
  };

  // retrieve plain text from editor's state
  getPlainText = () => {
    return this.state.editorState.getCurrentContent().getPlainText("\u0001");
  };

  // retrieve all hashtags from the entry
  getHashtags = () => {
    const text = this.getPlainText();
    const regex = /\B#\w\w+\b/g;
    const hashtags = text.match(regex);
    return hashtags;
  };

  // update the state and lowdb
  onSave = () => {
    const text = this.getPlainText();
    const hashtags = this.getHashtags();
    let entry = { ...this.state.entry };
    entry.text = text;
    entry.tags = hashtags;
    this.setState({ entry });
    // update lowdb with a new entry object
  };

  render() {
    return (
      <div className="editor">
        <Input
          onChange={this.onTitleChange}
          value={this.state.entry.title}
          className="title-input mt-2"
          type="text"
        ></Input>
        <Editor
          editorState={this.state.editorState}
          onChange={this.onChange}
          plugins={plugins}
          ref={element => {
            this.editor = element;
          }}
        />
        <InlineToolbar>
          {// may be use React.Fragment instead of div to improve perfomance after React 16
          externalProps => (
            <React.Fragment>
              <BoldButton {...externalProps} />
              <ItalicButton {...externalProps} />
              <UnderlineButton {...externalProps} />
              <linkPlugin.LinkButton {...externalProps} />
            </React.Fragment>
          )}
        </InlineToolbar>
        <Button
          outline
          color="secondary"
          className="mt-2"
          onClick={this.onSave}
        >
          Save
        </Button>
      </div>
    );
  }
}

export default TextEditor;
