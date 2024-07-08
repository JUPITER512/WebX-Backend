import { Asynchandler } from "../Utils/AsyncHandler.js";
import { User } from "../Models/User.models.js";
import { Chat } from "../Models/Chat.model.js";
import { AIResponse } from "../Models/AiMessages.js";
import { Message } from "../Models/SenderMessages.model.js";
import ollama from "ollama";
import e from "express";

export const aiGenerate = Asynchandler(async (req, res) => {
  const { message, aiModel } = req.body;
  const Chatid = req.headers.chatid;
  console.log(message,aiModel,Chatid)
  try {
    if (Chatid) {
      // Handle existing chat
      const alreadyExistedChat = await Chat.findById(Chatid);
      if (alreadyExistedChat) {
        await Message.create({
          chat: alreadyExistedChat._id,
          message: message,
        });

        // const modelFile =`FROM llama3
        // # sets the temperature to 1 [higher is more creative, lower is more coherent]
        // PARAMETER temperature 0.9`

        // await ollama.create({ model: aiModel, modelfile: modelFile })

        const messages = {
          role: "assistant",
          content: message,
        };

        const response = await ollama.chat({
          model: aiModel,
          messages: [messages],
          stream: true
        });

        let aireply = "";
        for await (const part of response) {
          res.write(part.message.content);
          aireply += part.message.content;
        }

        await AIResponse.create({
          chat: alreadyExistedChat._id,
          aiResponse: aireply,
        });

        // End the streamed response
        res.end();
      } else {
        res.status(404).json({ error: "Chat not found" });
      }
    } else {
      // Create new chat
      const titleResponse = await ollama.chat({
        model: aiModel,
        messages: [
          {
            role: "user",
            content: `Make a title for this prompt.Just create a title that I can set as the chat heading/ title for a better user experience.The example prompt is: "what's going on?" then you should give the title as "Current Events" and another example is if your response if like this ' A casual greeting!

I'd suggest the title: "Brotherly Love"

Feel free to use this title for our chat!' then title will only be "Brotherly Love" . Now, the prompt is: ${message}`,
          },
        ],
      });

      const user = req.user;
      const titleofChat = titleResponse.message.content;

      const chat = await Chat.create({
        title: titleofChat,
        createdBy: user._id,
      });

      await Message.create({
        chat: chat._id,
        message: message,
      });

      const messages = {
        role: "user",
        content: message,
      };

      const response = await ollama.chat({
        model: aiModel,
        messages: [messages],
        stream: true,
      });

      let aireply = "";
      for await (const part of response) {
        res.write(part.message.content);
        aireply += part.message.content;
      }

      await AIResponse.create({
        chat: chat._id,
        aiResponse: aireply,
      });

      // End the streamed response
      res.end();
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred" });
  }
});

export const getUserChat = Asynchandler(async (req, res) => {
  const userId = req.user._id;
  const chats = await Chat.find({ createdBy: userId });
  const userChatsId = chats.map((item, _) => {
    return { chatid: item._id, chatTitle: item.title };
  });
  res.status(200).json({ message: "Ok", chatIds: userChatsId });
});

export const getSpecificChat = Asynchandler(async (req, res) => {
  const { chatId } = req.query;
  const [AiChat, UserChat] = await Promise.all([
    AIResponse.find({ chat: chatId }).exec(),
    Message.find({ chat: chatId }).exec(),
  ]);
  const aiMessages=AiChat.map((item,index)=>{
    return { message: item.aiResponse, isUser: false, timeStamp: item.createdAt }
  })
  const userMessages = UserChat.map((item,index)=>{
    return { message: item.message, isUser: true, timeStamp: item.createdAt }
  })

  const message = [...userMessages, ...aiMessages,].sort((a, b) => { return new Date(a.timeStamp) - new Date (b.timeStamp)})
  res.status(200).json({
    message: "Success",
    messages: message,
  });
});

export const delete_chat=Asynchandler(async(req,res)=>{
  const {chatId}=req.body
  const chatresponse=await Chat.findByIdAndDelete(chatId)
  await AIResponse.deleteMany({chat:chatId})
  await Message.deleteMany({chat:chatId})
  if(!chatresponse){
    res.status(404).json({
      message:"Chat Id is invalid"
    })
  }
  res.status(200).json({
    message:"Chat Deleted Successfully"
  })
})
