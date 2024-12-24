import { create } from "zustand";
import toast from "react-hot-toast";
import {axiosInstance} from "../lib/axios"

export const useChatStore = create((set, get) => ({
    messages: [],
    users: [],
    selectedUser: null,
    isUsersLoading: false,
    isMessagesLoading: false,

    getUsers: async () => {
        set({isUsersLoading: true})
        try {
            const rep = await axiosInstance.get("/message/user")
            set({users: rep.data})
        } catch (error) {
            toast.error(error.response?.data?.message || "Erreur lors de la récupération des utilisateurs.")
        } finally {
            set({isUsersLoading: false})
        }
    },

    getMessages: async (userId) => {
        set({isMessagesLoading: true})
        try {
            const rep = await axiosInstance.get(`/message/${userId}`)
            set({messages: rep.data})
        } catch (error) {
            toast.error(error.response?.data?.message || "Erreur lors de la récupération de la conversation.")
        } finally {
            set({isMessagesLoading: false})
        }
    },

    sendMessage: async (messageData) => {
        const {selectedUser, messages} = get()
        try {
            const rep = await axiosInstance.post(`/message/send/${selectedUser._id}`, messageData)
            set({messages:[...messages, rep.data.newMessage]})
            toast.success(rep.data.message)
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || "Erreur lors de l'envoi! Veuillez réessayer.")
        }
    },

    setSelectedUser: (selectedUser) => set({selectedUser}),

    
}))