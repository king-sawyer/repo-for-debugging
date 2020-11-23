import React, { Component } from "react";
import { Route, Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import NoteListNav from "../NoteListNav/NoteListNav";
import NotePageNav from "../NotePageNav/NotePageNav";
import NoteListMain from "../NoteListMain/NoteListMain";
import NotePageMain from "../NotePageMain/NotePageMain";
import AddNote from "../AddNote/AddNote";
import AddFolder from "../AddFolder/AddFolder";
// import dummyStore from "../dummy-store";
import { getNotesForFolder, findNote, findFolder } from "../notes-helpers";
import "./App.css";

class App extends Component {
  state = {
    notes: [],
    folders: [],
  };

  componentDidMount() {
    const notesURL = "https://afternoon-hollows-77351.herokuapp.com/notes";
    const foldersURL = "https://afternoon-hollows-77351.herokuapp.com/folders";
    fetch(notesURL)
      .then((response) => {
        if (!response.ok) {
          return response.json().then((e) => Promise.reject(e));
        }
        return response.json();
      })
      .then((notes) => this.setState({ notes }))
      .catch((error) => {
        console.error(error);
      });
    fetch(foldersURL)
      .then((response) => {
        if (!response.ok) {
          return response.json().then((e) => Promise.reject(e));
        }
        return response.json();
      })
      .then((folders) => this.setState({ folders }))

      .catch((error) => {
        console.error(error);
      });
  }

  deleteNote = (noteID) => {
    const currentNotes = this.state.notes;
    this.setState({
      notes: currentNotes.filter((note) => note.id !== noteID),
    });

    fetch(`https://afternoon-hollows-77351.herokuapp.com/notes/${noteID}`, {
      method: "DELETE",
    })
      .then((response) => {
        if (!response.ok) {
          return (
            response.json().then((e) => Promise.reject(e)),
            this.setState({ notes: currentNotes })
          );
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };

  handleSubmit = (e, newNote) => {
    e.preventDefault();
    if (newNote.folder_id === undefined) {
      newNote.folder_id = "1";
    }

    fetch(`https://afternoon-hollows-77351.herokuapp.com/notes`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newNote),
    })
      .then((res) => {
        if (!res.ok) return res.json().then((e) => Promise.reject(e));
        return res.json();
      })
      .then((note) => {
        this.setState({ notes: [...this.state.notes, note] });
      })
      .catch((error) => {
        console.error(error);
      });
  };

  handleSubmitFolder = (e, title) => {
    e.preventDefault();

    fetch(`https://afternoon-hollows-77351.herokuapp.com/folders`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(title),
    })
      .then((res) => {
        if (!res.ok) {
          return res.json().then((e) => Promise.reject(e));
        } else {
          return res.json();
        }
      })
      .then((folder) => {
        this.setState({
          folders: [...this.state.folders, folder],
        });
      })
      .catch((error) => {
        console.error(error);
      });
  };

  renderNavRoutes() {
    const { notes, folders } = this.state;

    return (
      <>
        {["/", "/folder/:folderId"].map((path) => (
          <Route
            exact
            key={path}
            path={path}
            render={(routeProps) => (
              <NoteListNav folders={folders} notes={notes} {...routeProps} />
            )}
          />
        ))}
        <Route
          path="/note/:noteId"
          render={(routeProps) => {
            const { noteId } = routeProps.match.params;
            const note = findNote(notes, noteId) || {};
            const folder = findFolder(folders, note.folderId);
            return <NotePageNav {...routeProps} folder={folders} />;
          }}
        />
        <Route path="/add-folder" component={NotePageNav} />
        <Route path="/add-note" component={NotePageNav} />
      </>
    );
  }

  renderMainRoutes() {
    const { notes, folders } = this.state;

    return (
      <>
        {["/", "/folder/:folderId"].map((path) => (
          <Route
            exact
            key={path}
            path={path}
            render={(routeProps) => {
              let { folderId } = routeProps.match.params;

              const notesForFolder = getNotesForFolder(notes, folderId);
              return (
                <NoteListMain
                  {...routeProps}
                  deleteNote={this.deleteNote}
                  notes={notesForFolder}
                />
              );
            }}
          />
        ))}
        <Route
          path="/note/:noteId"
          render={(routeProps) => {
            const { noteId } = routeProps.match.params;
            const note = findNote(notes, noteId);
            return (
              <NotePageMain
                {...routeProps}
                deleteNote={this.deleteNote}
                note={note}
              />
            );
          }}
        />
        <Route
          path="/add-note"
          render={(routeProps) => {
            return (
              <AddNote
                {...routeProps}
                folders={folders}
                handleNoteChange={this.state.handleNoteChange}
                handleSubmit={this.handleSubmit}
                noteName={this.state.noteName}
              />
            );
          }}
        />

        <Route
          path="/add-folder"
          render={(routeProps) => {
            return (
              <AddFolder
                {...routeProps}
                handleSubmitFolder={this.handleSubmitFolder}
                folders={folders}
              />
            );
          }}
        />
      </>
    );
  }

  render() {
    return (
      <div className="App">
        <nav className="App__nav">{this.renderNavRoutes()}</nav>
        <header className="App__header">
          <h1>
            <Link to="/">Noteful</Link> <FontAwesomeIcon icon="check-double" />
          </h1>
        </header>
        <main className="App__main">{this.renderMainRoutes()}</main>
      </div>
    );
  }
}

export default App;
