import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { Mail, MessageSquare, User, Lock, EyeOff, Eye, Loader2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import AuthImagePattern from "../components/AuthImagePattern";
import { useForm } from "react-hook-form"

const SignUpPage = () => {
    const [showPassword, setShowPassword] = useState(false)
    const navigate = useNavigate()
    const { signUp, isSigningUp } = useAuthStore()
    const {register, handleSubmit, formState: {errors}} = useForm()
    const mdpRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/
    const emailRegex = /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/
    
    const onSubmit = async (data) => {
        const rep = await signUp(data)
        if(rep) {
            navigate("/login")
        }
    }

    return (
        <div className="min-h-screen grid lg:grid-cols-2">
            {/* La partie gauche de la page */}
            <div className="flex flex-col justify-center items-center p-6 sm:p-12">
                <div className="w-full max-w-md space-y-8">
                    {/* Le logo */}
                    <div className="text-center mb-8">
                        <div className="flex flex-col items-center gap-2 group">
                            <div className="size-12 rounded-xl bg-primary/10 flex items-center justify-center
                            group-hover:bg-primary/20 transition-colors"
                            >
                                <MessageSquare className="size-6 text-primary"/>
                            </div>
                            <h1 className="text-2xl font-bold mt-2">Créer un Compte</h1>
                            <p className="text-base-content/60">démarrez avec votre compte gratuit</p>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text font-medium">Nom complet</span>
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <User className="size-5 text-base-content/40"/>
                                </div>
                                <input
                                    type="text"
                                    className="input input-bordered w-full pl-10"
                                    placeholder="Votre nom complet"
                                    {...register("fullName", {
                                        required: "Ce champ est obligatoire!"
                                    })}
                                />
                            </div>
                            {errors.fullName && (
                                <span className="mt-2 text-sm text-red-500">
                                    {errors.fullName.message}
                                </span>
                            )}
                        </div>
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text font-medium">Email</span>
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Mail className="size-5 text-base-content/40"/>
                                </div>
                                <input
                                    type="email"
                                    className="input input-bordered w-full pl-10"
                                    placeholder="Votre adresse mail"
                                    {...register("email",{
                                        pattern: emailRegex,
                                        required: "Ce champ est obligatoire! Veuillez saisir un email valid"
                                    })}
                                />
                            </div>
                            {errors.email && (
                                <span className="mt-2 text-sm text-red-500">
                                    {errors.email.message}
                                </span>
                            )}
                        </div>
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text font-medium">Mot de Passe</span>
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock className="size-5 text-base-content/40"/>
                                </div>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    className="input input-bordered w-full pl-10"
                                    placeholder="********"
                                    {...register("password", {
                                        pattern: mdpRegex,
                                        minLength: 8,
                                        required: true
                                    })}
                                />
                                <button
                                 type="button"
                                 className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                 onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? (
                                        <EyeOff className="size-5 text-base-content/40"/>
                                    ) : (
                                        <Eye className="size-5 text-base-content/40"/>
                                    )}
                                </button>
                            </div>
                            {errors.password && (
                                <span className="mt-2 text-sm text-red-500">
                                    Ce champ est obligatoire! (Minimum: 1 maj, 1 min, 1 chiffre, 1 spé, 8 car).
                                </span>
                            )}

                            <button type="submit" className="mt-5 btn btn-primary w-full" disabled={isSigningUp}>
                                {isSigningUp ? (
                                    <>
                                        <Loader2 className="size-5 animate-spin"/>
                                        Chargement...
                                    </>
                                ) : (
                                    "Créer mon Compte"
                                )}
                            </button>
                        </div>
                    </form>
                    <div className="text-center">
                        <p className="text-base-content/60">
                            Vous avez déjà un compte?{" "}
                            <Link to="/login" className="link link-primary">
                                Se connecter
                            </Link>
                        </p>
                    </div>
                </div>
            </div>

            {/* La partie droite de la page */}
            <AuthImagePattern
                title="Rejoignez la communauté"
                subtitle="Connectez-vous avec vos amis, partagez des moments et restez en contact avec vos proches"
            />
        </div>
    );
}

export default SignUpPage;
