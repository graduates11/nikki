import { EditorState } from "draft-js";
import Editor from "draft-js-plugins-editor";
import createHashtagPlugin from "draft-js-hashtag-plugin";
import React from "react";
import { Button } from "reactstrap";

// Creates an Instance. At this step, a configuration object can be passed in
// as an argument.
const hashtagPlugin = createHashtagPlugin();
const plugins = [hashtagPlugin];

class TextEditor extends React.Component {
  state = {
    editorState: EditorState.createEmpty()
  };

  onChange = editorState => {
    this.setState({
      editorState
    });
  };

  getPlainText = () => {
    return this.state.editorState.getCurrentContent().getPlainText("\u0001");
  };

  getHashtags = () => {
    const text = this.getPlainText();
    const regex = /\B#\w\w+\b/g;
    const hashtags = text.match(regex);
    return hashtags;
  };

  onSave = () => {
    const text = this.getPlainText();
    const hashtags = this.getHashtags();
    console.log(text, hashtags);
    // set the plain text and hashtags in the entry's object
  };

  render() {
    return (
      <div className="editor">
        <h3>Date/Title</h3>
        <Editor
          editorState={this.state.editorState}
          onChange={this.onChange}
          plugins={plugins}
          ref={element => {
            this.editor = element;
          }}
        />
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
