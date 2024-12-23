import axios from "axios"

export const axiosInstance = axios.create({
    baseURL: "http://localhost:8080/api",
    withCredentials: true, //Pour envoyer les cookies à chaque requête
})