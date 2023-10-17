import { capitalizeFirstLetter, timestampToDate } from "../common/utils";
import React from "react";
import { toast } from "react-toastify";

import UserService from "../services/user.service";

// Icons
import delete_icon from "./delete_icon.png";
import download_icon from "./download_icon.png";
import edit_icon from "./edit_icon.png";

class FileView extends React.Component {
    constructor(props) {
        super(props);
        this.parentHandler = props.handler;
        this.uploadHandler = this.handleEdit.bind(this);
        this.name = props.file.name;
        this.id = props.file.id;
        this.downloadUrl = props.file.url;
        this.updateTimestamp = timestampToDate(props.file.updateTimestamp);
        this.owner = capitalizeFirstLetter(props.file.ownerFirstName) + " " + capitalizeFirstLetter(props.file.ownerLastName);
    }

    handleDelete(e){
        UserService.deleteFile(this.id).then(
            response => {
                toast.success(this.name + " deleted!");
                this.parentHandler();
            },
            error => {
                toast.error(this.name + " deletion failed!");
            }
        );
    }

    handleEdit(e){
        UserService.changeFile(this.id, e.target.files[0]).then(
            response => {
                toast.success(this.name + " edited!");
                this.parentHandler();
            },
            error => {
                var message = ( error.response && error.response.data && error.response.data.error ) 
                      || error.response.data.error || this.name + " edit failed!";
                toast.error(message);
            }
        );
    }

    render(){
        return (
            <tr className="content_border">
                 <td>{this.name}</td>
                 <td>{this.owner}</td>
                 <td>{this.updateTimestamp}</td>
                 <td>
                    <button className="file_op_btn"
                            type="submit"
                            style={{ backgroundImage: `url(${delete_icon})`}}
                            onClick={() => this.handleDelete()} />
                    <a className="file_op_btn"
                        href={this.downloadUrl} 
                        download={this.name}
                        style={{ backgroundImage: `url(${download_icon})`}} />
                    <form enctype="multipart/form-data">
                    <label for="file_update_btn" className="file_op_btn upload_label"
                        style={{ backgroundImage: `url(${edit_icon})`}}>
                            <input id="file_update_btn" type="file" hidden onChange={this.uploadHandler}/>
                    </label></form>
                    
                 </td>
            </tr>
        );
    }
}

export function FileListView(props){
    return (
        <table className="table table-hover">
            <thead className="thead-dark">
                <tr>
                    <th scope="col"  style={{ width: '30%' }}>Name</th>
                    <th scope="col"  style={{ width: '20%' }}>Owner</th>
                    <th scope="col" style={{ width: '25%' }}>Last Modified</th>
                    <th scope="col"></th>
                </tr>
            </thead>
            <tbody>
                {props.files && props.files.map(
                    (file, index) => <FileView file={ file } handler={ props.handler } />
                 )}
            </tbody>
        </table>
    );
}