import React from "react";

import "./AddNote.css";

class AddNote extends React.Component {
  state = {
    noteName: "",
    noteContent: "",
    notefolder: "",
    handleNoteChange: {
      changeName: (name) => {
        this.setState({
          noteName: name,
        });
      },
      changeContent: (content) => {
        this.setState({
          noteContent: content,
        });
      },
      changeFolder: (folder) => {
        this.setState({
          noteFolder: folder,
        });
      },
    },
  };

  render() {
    let newNote = {
      title: this.state.noteName,
      content: this.state.noteContent,
      folder_id: this.state.noteFolder,
    };

    return (
      <div className="AddNote">
        <h3>Add Note Form</h3>
        <form
          onSubmit={(e) => {
            this.props.handleSubmit(e, newNote);
            this.props.history.push("/");
          }}
        >
          <label>
            Note Title:{" "}
            <input
              value={this.state.noteName}
              onChange={(e) =>
                this.state.handleNoteChange.changeName(e.target.value)
              }
              required
              type="text"
              id="add-note-id"
              name="add-note-name"
            />
          </label>
          <br />
          <label>
            Note Content:{" "}
            <input
              onChange={(e) =>
                this.state.handleNoteChange.changeContent(e.target.value)
              }
              id="add-note-content-id"
              name="add-note-content-name"
              type="text"
            />
          </label>

          <select
            defaultValue={"1"}
            onChange={(e) =>
              this.state.handleNoteChange.changeFolder(e.target.value)
            }
          >
            {this.props.folders.map((folder) => {
              return (
                <option key={folder.id} value={folder.id}>
                  {folder.title}
                </option>
              );
            })}
          </select>
          <br />
          <button type="submit">Add Note</button>
        </form>
      </div>
    );
  }
}
export default AddNote;
