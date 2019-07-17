import * as React from "react";
import { Editor, EditorState } from "draft-js";
import { Button } from "reactstrap";

class TextEditor extends React.Component {
  // create a new EditorState and keep it in state
  constructor(props) {
    super(props);
    this.state = {
      // for displaying existing note:
      // 1.pass the entry through props
      // 2.entry: this.props.entry,
      // 3.createWithContent for displaying existing note
      // 4.parse contentState with JSON.parse() from lowdb and use it in the state to create content
      editorState: EditorState.createEmpty()
    };
  }
  // implement the onChange handler to update the EditorState
  editorStateChanged = newEditorState => {
    return this.setState({ editorState: newEditorState });
  };

  onSave = () => {
    //get content from editor's state:
    const content = this.state.editorState.getCurrentContent();
    // turn into json:
    const JSONcontent = JSON.stringify(content, null, 1);
    console.log(JSONcontent);
    // save that in lowdb in the entry object
  };

  render() {
    return (
      <div className="editor mt-2">
        <h3>Date/Title</h3>
        <Editor
          editorState={this.state.editorState}
          onChange={this.editorStateChanged}
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
