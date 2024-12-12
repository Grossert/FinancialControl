// hooks/auth.js
import { auth } from "../lib/firebaseconfig";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";

// Login function
export const login = async (email: string, password: string) => {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        console.log("Login realizado com sucesso");
        return userCredential; // Return the userCredential for further use
    } catch (err) {
        console.error("Erro ao autenticar: ", err);
        throw new Error("Erro ao autenticar. Verifique suas credenciais.");
    }
};

// Logout function
export const logout = async () => {
    try {
        await signOut(auth);
        console.log("Logout realizado com sucesso");
    } catch (err) {
        console.error("Erro ao realizar logout: ", err);
        throw new Error("Erro ao realizar logout.");
    }
};
