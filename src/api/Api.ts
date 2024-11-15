import { authSessionStorage } from "../utils/storage";
import { Auth } from "./generated/Auth";
import { Project } from "./generated/Project";
import { User } from "./generated/User";

const authToken = authSessionStorage.get()?.token;

const axiosConfig = {
  headers: {
    Authorization: `Bearer ${authToken}`,
  },
  baseURL: process.env.REACT_APP_API_URL,
};

export const authProjectApi = new Project(axiosConfig);
export const authUserApi = new User(axiosConfig);
export const authAuthApi = new Auth(axiosConfig);
