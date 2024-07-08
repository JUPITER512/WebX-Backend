import {v2 as cloudinary} from 'cloudinary'
import { error } from 'console';
import fs from 'fs';
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_SECRET
});

export const uploadCloudinary=async(filePath)=>{
    try {
        if(!filePath) return null;
        const response=await cloudinary.uploader.upload(filePath,{
            resource_type:'auto'
        })
        fs.unlinkSync(filePath)
        return response
    } catch (error) {
        fs.unlinkSync(filePath)
        
    }
}

export const deleteIamge=async(imageName)=>{
    try {
        if(!imageName) return null;
        const response = await cloudinary.uploader.destroy(imageName, (error, result)=>{
            if(error){
                console.log(error)
            }else{
                console.log(result)
            }
        })
        fs.unlinkSync(filePath)
        return response
    } catch (error) {
        fs.unlinkSync(filePath)
    }
}