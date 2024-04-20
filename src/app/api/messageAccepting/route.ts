import { getServerSession } from "next-auth";
import { AuthOptions } from "next-auth";
import databaseConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { User } from "next-auth";
import { authOpt } from "../auth/[...nextauth]/options";

export async function POST(request:Request) {
    await databaseConnect()
    const session = await getServerSession(authOpt)
    const user:User = session?.user

    if (!session || !session.user) {
        return Response.json(
            {
                success : false,
                message : "User not Authenticated"
            },
            {status:401}
        )
    }

    const userId = user._id;
    const {messageAccepting} = await request.json()


    try {
        const updatedUser = await UserModel.findByIdAndUpdate(
            userId,
            {isAcceptingMessage:messageAccepting},
            {new:true}
        )
        if (!updatedUser) {
            return Response.json(
                {
                    success : false,
                    message : "Fail to Update Status!"
                },
                {status:401}
            )
        }
        return Response.json(
            {
                success : true,
                message : "Updated Status!!✅",
                updatedUser
            },
            {status:200}
        )
        
    } catch (error) {
        console.error("Fail to Update Status!" , error )
        return Response.json(
            {
                success : false,
                message : "Fail to Update Status!"
            },
            {status:500}
        )
    }
    
}

export async function GET(request:Request) {
    await databaseConnect()

    const session = await getServerSession(authOpt)
    const user:User = session?.user

    if (!session || !session.user) {
        return Response.json(
            {
                success : false,
                message : "User not Authenticated!"
            },
            {status : 401}
        )
    }

    const userId = user._id;

    try {
        const findingUser = await UserModel.findById(userId)
        if (!findingUser) {
            return Response.json(
                {
                    success : false,
                    message : "User not Found"
                },
                {status : 404}
            )
        }
        return Response.json(
            {
                success : true,
                isAcceptingMessage : findingUser.isAcceptingMessage
            },
            {status : 200}
        )
    } catch (error) {
        console.error("Fail to Accepting Messages !!" , error )
        return Response.json(
            {
                success : false,
                message : "Fail to Accepting Messages !!"
            },
            {status:500}
        )
    }
}