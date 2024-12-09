import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"

import api from "./../api/api"

//TODO: implement flashMessages ?

export default function useAuth() {
    const [authenticated, setAuthenticated] = useState(false)
    const history = useNavigate()

    useEffect(() => {
        const token = localStorage.getItem('token')
        
        if (token) {
            api.defaults.headers.Authorization = `Bearer ${JSON.parse(token)}`
            setAuthenticated(true)
        }
    }, [])

    async function login(user) {
        try {
            const data = await api.post('/user/login', user).then((response) => {
                return response.data
            })

            await authUser(data)
        } catch (error) {
            console.log(error)
        }
    }
        
    async function register(user) {
        try {
            const data = await api.post('/user/register', user).then((response) => {
                return response.data
            })
            await authUser(data)
        } catch (error) {
            // tratar erro
            console.log(error)
        }
    }

    async function logout(user) {
        setAuthenticated(false)
        localStorage.removeItem('token')
        api.defaults.headers.Authorization = undefined
        history.push('/')
    }

    async function authUser(data) {
        setAuthenticated(true)
        localStorage.setItem('token', JSON.stringify(data.token))

        history.push('/dashboard')
    }

    return { authenticated, login, logout, register }
}