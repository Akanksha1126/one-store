import React, { Component } from "react";

import UserService from "../services/user.service";
import EventBus from "../common/EventBus";
import { compareFileUpdateTime } from "../common/userFileUtils";
import AuthService from "../services/auth.service";
import { Navigate } from "react-router-dom";
import { FileListView } from "./files-list.component";

export default class BoardAdmin extends Component {
  constructor(props) {
    super(props);

    this.handler = this.handler.bind(this);

    this.state = {
      redirect: null,
      content: "",
      files: []
    };
  }

  handler() {
    this.fetchData();
  }

  fetchData() {
    UserService.getAdminBoard().then(
      response => {
        this.setState({
          // store file in order of their update time.
          files: response.data.sort(compareFileUpdateTime).reverse()
        });
      },
      error => {
        this.setState({
          content:
            (error.response &&
              error.response.data &&
              error.response.data.message) ||
            error.message ||
            error.toString()
        });

        if (error.response && error.response.status === 401) {
          EventBus.dispatch("logout");
        }
      }
    );
  }

  componentDidMount() {
    const currentUser = AuthService.getCurrentUser();
    if(!currentUser){
      this.setState({redirect: "/home"});
      return;
    }
    this.fetchData();
  }

  render() {
    if (this.state.redirect) {
      return <Navigate to={this.state.redirect} />
    }
    
    return (
      <div className="container">
        <header className="jumbotron content_border">
          <div>
            <h2 className="inline_text">Admin Board!</h2>
            <h3>{this.state.content}</h3>
          </div>
        </header>
        <div>
          <div className="content_border my_drive_header">
            Files
          </div>
          <FileListView files={this.state.files} handler={this.handler} />
        </div>
      </div>
    );
  }
}