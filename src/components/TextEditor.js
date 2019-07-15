import * as React from "react";
import { Editor, EditorState } from "draft-js";

class TextEditor extends React.Component {
  // create a new EditorState and keep it in state
  constructor(props) {
    super(props);
    this.state = { editorState: EditorState.createEmpty() };
  }

  // implement the onChange handeler up update the EditorState

  editorStateChanged = newEditorState => {
    return this.setState({ editorState: newEditorState });
  };

  render() {
    return (
      <div className="editor">
        <Editor
          editorState={this.state.editorState}
          onChange={this.editorStateChanged}
        />
      </div>
    );
  }
}

export default TextEditor;
