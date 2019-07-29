import { EditorState, ContentState } from "draft-js";
import Editor from "draft-js-plugins-editor";
import createHashtagPlugin from "draft-js-hashtag-plugin";
import createInlineToolbarPlugin from "draft-js-inline-toolbar-plugin";
import createLinkPlugin from "draft-js-anchor-plugin";
import { ItalicButton, BoldButton, UnderlineButton } from "draft-js-buttons";
import React from "react";
import { Button, Input } from "reactstrap";
import { Store } from "./Store";

const { ipcRenderer } = window;
const hashtagPlugin = createHashtagPlugin();
const inlineToolbarPlugin = createInlineToolbarPlugin();
const linkPlugin = createLinkPlugin();
const { InlineToolbar } = inlineToolbarPlugin;
const plugins = [hashtagPlugin, inlineToolbarPlugin, linkPlugin];

class TextEditor extends React.Component {
  // connect to the store:
  static contextType = Store;

  state = {
    entry: {
      id: "default_id",
      text: "Your text...",
      title: "Your title...",
      date: new Date()
    },
    editorState: EditorState.createEmpty()
  };

  onChange = editorState => {
    this.setState({
      editorState
    });
  };

  componentDidUpdate() {
    const currentEntry = this.context.state.entry;
    if (currentEntry.id !== this.state.entry.id) {
      this.setState({
        entry: currentEntry,
        // if entry has editors state set it to that else:
        editorState: EditorState.createWithContent(
          ContentState.createFromText(currentEntry.text)
        )
      });
    }
  }

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

  onSave = () => {
    this.updateEntry();
  };

  updateEntry = () => {
    // call ipc and save the entry from state + plus editorsState
    const { entry, editorState } = this.state;
    const hashtags = this.getHashtags();
    const text = this.getPlainText();
    const updatedEntry = {
      ...entry,
      editorState: editorState,
      text,
      tags: hashtags
    };

    if (
      this.context.state.allEntries.find(
        entry => entry.id === updatedEntry.id
      ) !== undefined
    ) {
      // DISPATCH UPDATE ENTRY
    } else {
      // DISPATCH ADD ENTRY
    }
  };

  deleteEntry = () => {
    // DISPATCH DELETE ENTRY
  };

  render() {
    return (
      <section className="editor">
        <div className="entry-header">
          <span className="entry-date mt-2">
            {new Date(this.state.entry.date).toDateString()}
          </span>
          <Input
            onChange={this.onTitleChange}
            value={this.state.entry.title}
            className="title-input mt-2"
            type="text"
            maxLength="50"
          ></Input>
        </div>

        <Editor
          editorState={this.state.editorState}
          onChange={this.onChange}
          plugins={plugins}
          ref={element => {
            this.editor = element;
          }}
        />
        <InlineToolbar>
          {externalProps => (
            <React.Fragment>
              <BoldButton {...externalProps} />
              <ItalicButton {...externalProps} />
              <UnderlineButton {...externalProps} />
              <linkPlugin.LinkButton {...externalProps} />
            </React.Fragment>
          )}
        </InlineToolbar>
        <Button outline color="secondary" className="m-2" onClick={this.onSave}>
          Save
        </Button>
        <Button
          outline
          color="secondary"
          className="m-2"
          onClick={this.deleteEntry}
        >
          Delete
        </Button>
      </section>
    );
  }
}

export default TextEditor;
