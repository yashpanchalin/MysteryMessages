import { NextAuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import databaseConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { any } from "zod";


export const authOpt:NextAuthOptions = {
    providers : [
        Credentials({
            id : "credentials",
            name : "Credentials",
            credentials:{
                email : {label : "Email" , type:"text"},
                password : {label : "Password" , type : "password"},
            },
            async authorize (credentials:any):Promise<any> {
                await databaseConnect()
                try {
                    const user = await UserModel.findOne({
                        $or:[
                            {email: credentials.identifier},
                            {password : credentials.identifier}
                        ]
                    })

                    if (!user) {
                        throw new Error("No such User is found by given E-mail")
                    }

                    if (!user.isVerified) {
                        throw new Error("Verify your Account before login in")
                    }

                    const isPassword = await bcrypt.compare(credentials.password, user.password)
                    if (isPassword) {
                        return user
                    } else{
                        throw new Error("Incorrect Password")
                    } {
                        throw new Error("No such User is found by given E-mail/Password");
                    }

                } catch (err:any) {
                    throw new Error(err)
                }
            }
        })
    ],
    callbacks:{
        async jwt({token, user}){
            if (user) {
                token._id = user._id?.toString();
                token.isVerified = user.isVerified;
                token.isAcceptingMessages = user.isAcceptingMessages;
                token.username = user.username;
            }
            return token
        },
        async session({ session, token}){
            if (token) { 
                session.user._id = token._id
                session.user.isVerified = token.isVerified
                session.user.isAcceptingMessages = token.isAcceptingMessages
                session.user.username = token.username
            }
            return session
        },
        
    },
    pages:{
        signIn: 'sign-in'
    },
    session:{
        strategy: "jwt"
    },
    secret: process.env.NEXTAUTH_SSK,

}