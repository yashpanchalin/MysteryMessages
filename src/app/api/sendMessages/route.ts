import databaseConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { Message } from "@/model/User";

export async function POST(request:Request){
    await databaseConnect()

    const {username , content} = await request.json();

    try {
        const user = await UserModel.findOne({username})
        if (!user) {
            return Response.json(
                {
                    success : false,
                    message : "User not found"
                },
                {status:404}
            )
        }
//checking whether the student accepting the messages or not?

        if (!user.isAcceptingMessage) {
            return Response.json(
                {
                    success : false,
                    message : "User not accepting the messages"
                },
                {status:403}
            )
        }

        const newMessage = {content , createdAt:new Date()}
        user.messages.push(newMessage as Message)
        await user.save()
    } catch (error) {
        console.log("Error rendering the messages", error);
        
        return Response.json(
            {
                success : false,
                message : "Internal Server Error"
            },
            {status:500}
        )
    }
}