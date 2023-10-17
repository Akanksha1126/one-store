import axios from "axios";
import { API_URL } from "../common/const";

// It handles user authentication.
// Once authenticated, the user information is saved in local storage is "field:user"
class AuthService {
  constructor(){
    // Supported Method: REST.POST
    this.sign_in_url = API_URL + "/auth/signin";
    // Supported Method: REST.POST
    this.sign_up_url = API_URL + "/auth/signup";
    this.local_storage_key = "user";
  }

  login(email, password) {
    return axios
      .post(this.sign_in_url, {
        email,
        password
      })
      .then(response => {
        if (response.data.accessToken) {
          localStorage.setItem(this.local_storage_key, JSON.stringify(response.data));
        }

        return response.data;
      });
  }

  logout() {
    localStorage.removeItem(this.local_storage_key);
  }

  register(firstname, lastname, email, password) {
    return axios.post(this.sign_up_url, {
      firstname,
      lastname,
      email,
      password
    });
  }

  getCurrentUser() {
    return JSON.parse(localStorage.getItem(this.local_storage_key));;
  }
}

export default new AuthService();