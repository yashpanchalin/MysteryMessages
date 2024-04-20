import databaseConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { z } from "zod";

export async function GET(request:Request){
    await databaseConnect() 
    try {
        const {username, Code} = await request.json()

        const decodedUsername = decodeURIComponent(username)
        const user = await UserModel.findOne({username:decodedUsername})
        
        if (!user) {
            return Response.json(
                {
                    success : false,
                    message : "Error Validating user"
                },
                {status:500}
            )
        }

        const codeValidation = user.verifyCode === Code

        const codeExpiration = new Date() < new Date(user.verifyCodeExpiry
        ) 

        if (codeValidation && codeExpiration) {
            user.isVerified === true
            await user.save()

            return Response.json(
                {
                    success : true,
                    message : "User Verified Successfully ✅"
                },
                {status:200}
            )
        }else if (!codeValidation) {
            return Response.json(
                {
                    success : false,
                    message : "Uable to Verify Code"
                },
                {status:500}
            )
        }else{
            return Response.json(
                {
                    success : false,
                    message : "Code has been expired! DO SIGN-UP AGAIN!!"
                },
                {status:500}
            )
        }



    } catch (error) {
        console.error("Error Validating Code" , error)
        return Response.json(
            {
                success : false,
                message : "Error Validating Code"
            },
            {status:500}
        )
    }
}