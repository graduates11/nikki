import React from "react";
import { Store } from "./Store";
import { Input } from "reactstrap";
import { EditorState, convertToRaw, convertFromRaw } from "draft-js";
import { DateChanger } from "./index";
import editorStyles from "../css/editorStyles.css";
import Editor from "draft-js-plugins-editor";
import createHashtagPlugin from "draft-js-hashtag-plugin";
import {
  ItalicButton,
  BoldButton,
  UnderlineButton,
  CodeButton,
  HeadlineOneButton,
  HeadlineTwoButton,
  HeadlineThreeButton,
  UnorderedListButton,
  OrderedListButton
} from "draft-js-buttons";
import createInlineToolbarPlugin from "draft-js-inline-toolbar-plugin";
import createLinkPlugin from "draft-js-anchor-plugin";
const hashtagPlugin = createHashtagPlugin();
const inlineToolbarPlugin = createInlineToolbarPlugin();
const linkPlugin = createLinkPlugin();
const { InlineToolbar } = inlineToolbarPlugin;
const plugins = [hashtagPlugin, inlineToolbarPlugin, linkPlugin];

class HeadlinesPicker extends React.Component {
  componentDidMount() {
    setTimeout(() => {
      window.addEventListener("click", this.onWindowClick);
    });
  }

  componentWillUnmount() {
    window.removeEventListener("click", this.onWindowClick);
  }

  onWindowClick = () =>
    // Call `onOverrideContent` again with `undefined`
    // so the toolbar can show its regular content again.
    this.props.onOverrideContent(undefined);

  render() {
    const buttons = [HeadlineOneButton, HeadlineTwoButton, HeadlineThreeButton];
    return (
      <div>
        {buttons.map((
          Button,
          i // eslint-disable-next-line
				) => (
          <Button key={i} {...this.props} />
        ))}
      </div>
    );
  }
}

class HeadlinesButton extends React.Component {
  // When using a click event inside overridden content, mouse down
  // events needs to be prevented so the focus stays in the editor
  // and the toolbar remains visible  onMouseDown = (event) => event.preventDefault()
  onMouseDown = event => event.preventDefault();

  onClick = () =>
    // A button can call `onOverrideContent` to replace the content
    // of the toolbar. This can be useful for displaying sub
    // menus or requesting additional information from the user.
    this.props.onOverrideContent(HeadlinesPicker);

  render() {
    return (
      <div
        onMouseDown={this.onMouseDown}
        className={editorStyles.headlineButtonWrapper}
      >
        <button
          onClick={this.onClick}
          id="styledHeadlinesButton"
          className={editorStyles.headlineButton}
        >
          H
        </button>
      </div>
    );
  }
}

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

  getPlainText = () => {
    return this.state.editorState.getCurrentContent().getPlainText("\u0001");
  };

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
          <div id="underlinedEntryHeader">
            <Input
              autoFocus
              onChange={this.onTitleChange}
              value={this.state.entry.title}
              className="title-input mt-2"
              type="text"
              maxLength="75"
              onBlur={this.updateEntry}
            ></Input>
          </div>
          <DateChanger />
        </div>

        <Editor
          editorState={this.state.editorState}
          onChange={this.onChange}
          plugins={plugins}
          placeholder="Type here…"
          ref={element => {
            this.editor = element;
          }}
          onBlur={this.updateEntry}
        />
        <InlineToolbar>
          {externalProps => (
            <div id="inlineToolbar">
              <BoldButton {...externalProps} />
              <ItalicButton {...externalProps} />
              <UnderlineButton {...externalProps} />
              <HeadlinesButton {...externalProps} />
              <UnorderedListButton {...externalProps} />
              <OrderedListButton {...externalProps} />
              <CodeButton {...externalProps} />
            </div>
          )}
        </InlineToolbar>
      </section>
    );
  }
}

export default TextEditor;
