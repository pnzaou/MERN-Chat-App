import {create} from 'zustand'
import {axiosInstance} from '../lib/axios'
import toast from 'react-hot-toast'
import { data } from 'react-router-dom'

export const useAuthStore = create((set) => ({
    authUser: null,
    isSigningUp: false,
    isLogginingIn: false,
    isUpdatingProfile: false,
    isCheckingAuth: true,
    checkAuth: async () => {
        try {
            const rep = await axiosInstance.get("/auth/check")
            set({authUser: rep.data})
        } catch (error) {
            console.log(error);
            set({authUser:null})
        } finally {
            set({isCheckingAuth:false})
        }
    },

    signUp: async (data) => {
        set({isSigningUp: true})
        try {
            const rep = await axiosInstance.post("/auth/signup", data)
            toast.success(rep.data.message)
            return true
        } catch (error) {
            toast.error(error.response?.data?.message || "Erreur lors de l'inscription ! Veuillez réessayer.")
            return false
        } finally {
            set({isSigningUp: false})
        }
    },

    login: async (data) => {
        set({isLogginingIn: true})
        try {
            const rep = await axiosInstance.post("/auth/login", data)
            set({authUser: rep.data?.user})
            toast.success(rep.data.message)
        } catch (error) {
            toast.error(error.response?.data?.message || "Erreur lors de la connexion! Veuillez réessayer")
        } finally {
            set({isLogginingIn: false})
        }
    },

    logout: async () => {
        try {
            const rep = await axiosInstance.post("/auth/logout")
            set({authUser: null})
            toast.success(rep.data.message)
        } catch (error) {
            toast.error(error.response?.data?.message || "Erreur ! Veuillez réessayer")
        }
    },

    updateProfile: async (data) => {
        console.log(data);
        set({isUpdatingProfile: true})
        try {
            const rep = await axiosInstance.put("/auth/update-profile", data)
            set({authUser: rep.data.updatedUser})
            toast.success(rep.data.message)
        } catch (error) {
            console.log(error);
            toast.error(error.response?.data?.message || "Erreur ! Veuillez réessayer")
        } finally {
            set({isUpdatingProfile: false})
        }
    }
}))