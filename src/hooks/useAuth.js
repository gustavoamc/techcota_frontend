import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"

import api from "../utils/api"
import useFlashMessage from "./useFlashMessage"

export default function useAuth() {
    const [authenticated, setAuthenticated] = useState(false)
    const { setFlashMessage } = useFlashMessage()
    const navigate = useNavigate()

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
            setFlashMessage(error.response.data.message, 'error') //to shorten the code
        }
    }
        
    async function register(user) {
        try {
            const data = await api.post('/user/register', user, {
                'Content-Type': 'multipart/form-data'
            })
            .then((response) => {
                return response.data
            })
            await authUser(data)
        } catch (error) {
            setFlashMessage(error.response.data.message, 'error')
        }
    }

    async function logout() {
        setAuthenticated(false)
        localStorage.removeItem('token')
        api.defaults.headers.Authorization = undefined
        navigate('/')
    }

    async function authUser(data) {
        setAuthenticated(true)
        localStorage.setItem('token', JSON.stringify(data.token))

        navigate('/dashboard')
    }

    return { authenticated, login, logout, register }
}