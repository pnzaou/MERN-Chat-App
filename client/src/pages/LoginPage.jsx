import { useState } from "react";
import { useForm } from "react-hook-form";
import { useAuthStore } from "../store/useAuthStore";
import AuthImagePattern from "../components/AuthImagePattern";
import { Link } from "react-router-dom";
import { Eye, EyeOff, Loader2, Lock, Mail, MessageSquare } from "lucide-react";

const LoginPage = () => {
    const [showPassword, setShowPassword] = useState(false)
    const {login, isLogginingIn} = useAuthStore()
    const {register, handleSubmit, formState: {errors}} = useForm()
    const mdpRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/
    const emailRegex = /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/

    const onSubmit = (data) => {
        console.log(data);
        login(data)
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
                            <h1 className="text-2xl font-bold mt-2">Content de te revoir</h1>
                            <p className="text-base-content/60">Connecte-toi à ton compte</p>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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

                            <button type="submit" className="mt-5 btn btn-primary w-full" disabled={isLogginingIn}>
                                {isLogginingIn ? (
                                    <>
                                        <Loader2 className="size-5 animate-spin"/>
                                        Chargement...
                                    </>
                                ) : (
                                    "Se Connecter"
                                )}
                            </button>
                        </div>
                    </form>
                    <div className="text-center">
                        <p className="text-base-content/60">
                            Vous n&apos;avez pas de compte?{" "}
                            <Link to="/signup" className="link link-primary">
                                S&apos;inscrire
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

export default LoginPage;
