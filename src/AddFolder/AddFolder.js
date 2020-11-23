import React from "react";
import "./AddFolder.css";
class AddFolder extends React.Component {
  state = {
    title: "",
    handleFolderChange: {
      changetitle: (name) => {
        this.setState({
          title: name,
        });
      },
    },
  };

  render() {
    let newFolder = { title: this.state.title };
    return (
      <div className="AddFolder">
        <h3>Add Folder Form</h3>
        <form
          onSubmit={(e) => {
            this.props.handleSubmitFolder(e, newFolder);
            this.props.history.push("/");
          }}
        >
          <label>
            Folder Name:{" "}
            <input
              value={this.state.title}
              onChange={(e) =>
                this.state.handleFolderChange.changetitle(e.target.value)
              }
              required
              type="text"
              id="add-folder-id"
              name="add-folder-name"
            />
          </label>
          <br />
          <p>
            (Be careful! Once you make a folder you cant delete it using this
            client!)
          </p>
          <br />
          <button type="submit">Add Folder</button>
        </form>
      </div>
    );
  }
}
export default AddFolder;
