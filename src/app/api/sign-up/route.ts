import databaseConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import bcrypt from "bcryptjs";
import { sendVerificationEmails } from "@/helpers/sendVerificationEmails";
import { useEffect } from "react";
import { Turret_Road } from "next/font/google";
import { messageSchema } from "@/Schemas/messageSchema";

export async function POST(request:Request) {
    await databaseConnect()

    try {
        const {username, password, email} = await request.json()
        const existingUserVerifiedByUsername = await UserModel.findOne({
            username,
            isVerified:true
        })

        if (existingUserVerifiedByUsername) {
            return Response.json({
                success:false,
                messsage:"Username already taken"
            }, {status:400})
        }

        const existingUserVerifiedByEmail = await UserModel.findOne({email});
        const verifyCode = Math.floor(100000 + Math.random() * 900000).toString()

        if (existingUserVerifiedByEmail) {
            if (existingUserVerifiedByEmail.isVerified) {
                return Response.json({
                    success : false,
                    message : "User Does Already Exist"
                },{status:400})
            } else{
                const hashedPassword = await bcrypt.hash(password,10)
                existingUserVerifiedByEmail.password = hashedPassword;
                existingUserVerifiedByEmail.verifyCode = verifyCode;
                existingUserVerifiedByEmail.verifyCodeExpiry = new Date(Date.now()+3600000)
                await existingUserVerifiedByEmail.save()
            }
        } else {
            const hashedPassword = await bcrypt.hash(password,10);
            const expiryDate = new Date()
            expiryDate.setHours(expiryDate.getHours() + 1)
            
            const newUser = new UserModel({
                username,
                email,
                password:hashedPassword,
                verifyCode,
                verifyCodeExpiry:expiryDate,
                isVerified:false,
                isAcceptingMessage:true,
                messages:[]
            })

            await newUser.save()
        }
         
        // Send Veriffication Email
        const emailResponse = await sendVerificationEmails(
            email,
            username,
            verifyCode,
        )

        if (!emailResponse.success) {
            return Response.json({
                success : false,
                message : emailResponse.message
            }, {status:500})
        }
        return Response.json({
            success : true,
            message : "User Registration Successfull. Please verify your e-mail"
        },{status:200})

    } catch (error) {
        console.error("Error Registering User", error);
        return Response.json({
            success : false,
            message : "Error Registering User"
        }),
        {
            status : 500
        }
    }
}