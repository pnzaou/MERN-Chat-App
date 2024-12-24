import { create } from "zustand";
import toast from "react-hot-toast";
import {axiosInstance} from "../lib/axios"
import { useAuthStore } from "./useAuthStore";

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

    subscribeToMessages: () => {
        const { selectedUser } = get()
        if(!selectedUser) return;

        const socket = useAuthStore.getState().socket

        socket.on("newMessage", (newMessage) => {
            if(newMessage.senderId !== selectedUser._id) return
            set({
                messages: [...get().messages, newMessage]
            })
        })
    },

    unsubscribeToMessages: () => {
        const socket = useAuthStore.getState().socket
        socket.off("newMessage")
    },

    setSelectedUser: (selectedUser) => set({selectedUser}),

    
}))