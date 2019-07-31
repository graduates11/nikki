import { EditorState, ContentState } from "draft-js";
import Editor from "draft-js-plugins-editor";
import createHashtagPlugin from "draft-js-hashtag-plugin";
import createInlineToolbarPlugin from "draft-js-inline-toolbar-plugin";
import createLinkPlugin from "draft-js-anchor-plugin";
import { ItalicButton, BoldButton, UnderlineButton } from "draft-js-buttons";
import React from "react";
import { Button, Input } from "reactstrap";
import { Store } from "./Store";
import { DeleteEntry, DateChanger } from "./index";

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

  updateEntry = () => {
    const { entry, editorState } = this.state;
    const hashtags = this.getHashtags();
    const text = this.getPlainText();

    const updatedEntry = {
      ...entry,
      editorState: editorState,
      text,
      tags: hashtags
    };

    this.context.dispatch({
      type: "UPDATE_ENTRY",
      payload: {
        entry: updatedEntry
      }
    });
  };

  render() {
    return (
      <section className="editor">
        <div className="entry-header">
          <Input
            autoFocus
            onChange={this.onTitleChange}
            value={this.state.entry.title}
            className="title-input mt-2"
            type="text"
            maxLength="50"
          ></Input>
          <DateChanger />
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
        <Button
          outline
          color="secondary"
          className="m-2"
          onClick={this.updateEntry}
        >
          Save
        </Button>
        <Button
          outline
          color="secondary"
          className="m-2"
          onClick={this.props.addEntry}
        >
          Add entry
        </Button>
        <DeleteEntry id={this.state.entry.id} />
      </section>
    );
  }
}

export default TextEditor;
