import { EditorState, convertToRaw, convertFromRaw } from "draft-js";
import Editor from "draft-js-plugins-editor";
import createHashtagPlugin from "draft-js-hashtag-plugin";
import { ItalicButton, BoldButton, UnderlineButton } from "draft-js-buttons";
import createInlineToolbarPlugin from "draft-js-inline-toolbar-plugin";
import createLinkPlugin from "draft-js-anchor-plugin";
import React from "react";
import { Input } from "reactstrap";
import { Store } from "./Store";
import { DateChanger } from "./index";

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
      date: new Date(),
      modal: false
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
      const content = convertFromRaw(currentEntry.editorState);
      this.setState({
        entry: currentEntry,
        editorState: EditorState.createWithContent(content)
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
    const content = convertToRaw(editorState.getCurrentContent());
    const updatedEntry = {
      ...entry,
      editorState: content,
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

  toggleModal = () => {
    this.setState({ modal: !this.state.modal });
  };

  render() {
    return (
      <section className="editor rightColumn">
        <div className="entry-header">
          <Input
            autoFocus
            onChange={this.onTitleChange}
            value={this.state.entry.title}
            className="title-input mt-2"
            type="text"
            maxLength="75"
            onBlur={this.updateEntry}
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
          onBlur={this.updateEntry}
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
      </section>
    );
  }
}

export default TextEditor;
