import { useState } from "react"

import api from "./../api/api"

export default function useAuth() {
    const [authenticated, setAuthenticated] = useState(false)
    //TODO: implement 3 functions to handle login, logout and register

    async function login(user) {
        console.log("login")
    }
        
    async function register(user) {
        console.log("register")
    }

    async function logout(user) {
        console.log("logout")
    }    

    return { authenticated, login, logout, register }
}