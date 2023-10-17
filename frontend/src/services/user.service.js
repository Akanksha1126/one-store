import axios from 'axios';
import { authHeader, fileUploadHeader } from './auth-header';
import { API_URL } from '../common/const';

const maxAllowedFileSize = 1024 * 1024 * 10; // 10 MB

class UserService {
  constructor(){
    this.public_content_url = API_URL + "/all";
    // Supported Method: REST.GET
    this.user_board_url = API_URL + "/file/list";
    // Supported Method: REST.GET
    this.admin_dashboard_url = API_URL + "/file/admin/list";
    // Supported Method: REST.POST
    this.file_create_url = API_URL + "/file/create";
    // Supported Method: REST.POST
    this.file_update_url = API_URL + "/file/update/";
    // Supported Method: REST.DELETE
    this.file_delete_url = API_URL + "/file/";
  }

  getPublicContent() {
    return axios.get(this.public_content_url);
  }

  getUserBoard() {
    return axios.get(this.user_board_url, { headers: authHeader() });
  }

  getAdminBoard() {
    return axios.get(this.admin_dashboard_url, { headers: authHeader() });
  }

  deleteFile(fileId) {
    return axios.delete(this.file_delete_url + fileId, { headers: authHeader() })
  }

  createFile(file) {
    if(file.size > maxAllowedFileSize){
      var error = {"response" : {"data": {"error" : "File is larger than 10 MBs!" }}};
      return Promise.reject(error);
    };
    const formData = new FormData();
    formData.append('file', file);
    formData.append('fileName', file.name);
    return axios.post(this.file_create_url, formData, { headers: fileUploadHeader() })
  }

  changeFile(fileId, file){
    if(file.size > maxAllowedFileSize){
      var error = {"response" : {"data": {"error" : "File is larger than 10 MBs!" }}};
      return Promise.reject(error);
    };
    const formData = new FormData();
    formData.append('file', file);
    formData.append('fileName', file.name);
    return axios.post(this.file_update_url + fileId, formData, { headers: fileUploadHeader() })
  }
}

export default new UserService();