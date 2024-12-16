import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"

import api from "./../api/api"

export default function useAuth() {
    const [authenticated, setAuthenticated] = useState(false)
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
            console.log(error)
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
            // tratar erro
            console.log(error)
        }
    }

    async function logout(user) {
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