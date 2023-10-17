import React, { Component } from "react";

import UserService from "../services/user.service";
import EventBus from "../common/EventBus";
import { compareFileUpdateTime } from "../common/userFileUtils";
import AuthService from "../services/auth.service";
import { Navigate } from "react-router-dom";
import { FileListView } from "./files-list.component";
import { toast } from "react-toastify";
import { capitalizeFirstLetter } from "../common/utils";


export default class BoardUser extends Component {
  constructor(props) {
    super(props);

    this.handler = this.handler.bind(this);
    this.createHandler = this.createHandler.bind(this);

    this.state = {
      redirect: null,
      content: "",
      files: [],
      user: null
    };
  }

  handler() {
    this.fetchData();
  }

  createHandler(e) {
    const fileName = e.target.files[0].name;
    console.log(fileName);
    UserService.createFile(e.target.files[0]).then(
      response => {
        toast.success(fileName + " uploaded!");
        this.fetchData();
      },
      error => {
        var message = ( error.response && error.response.data && error.response.data.error ) 
                      || error.response.data.error || fileName + " upload failed!";
        toast.error(message);
      }
    );
  }

  getUserName() {
    return this.state.user 
          ? capitalizeFirstLetter(this.state.user.firstName) + " " + capitalizeFirstLetter(this.state.user.lastName)
          : "Guest";
  }

  fetchData() {
    UserService.getUserBoard().then(
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
    this.setState({
      user: currentUser
    });

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
            <h2 className="inline_text">Hello {this.getUserName()}!</h2>
            <h3>{this.state.content}</h3>
          </div>
        </header>
        <div>
          <div className="content_border my_drive_header">
            My Drive
            <form enctype="multipart/form-data" class="upload_file_form">
              <label for="file_create_btn" className="btn btn-primary">File Upload
                <input id="file_create_btn" type="file" hidden  onChange={this.createHandler}/>
              </label>
            </form>
          </div>
          <FileListView files={this.state.files} handler={this.handler}/>
        </div>
      </div>
    );
  }
}