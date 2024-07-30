import axios from 'axios';

export const uploadOnCloudinary = async(file,type="image") =>{
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'eCommerce');
    formData.append('cloud_name', "dudcrgnld");

  console.log({formData})

    try {
      const response = await axios.post(`https://api.cloudinary.com/v1_1/dudcrgnld/${type}/upload`, formData,{
        resource_type:"auto",
      });
      console.log(response.data.url)
      return response.data.url
    } catch (error) {
      console.log("error while uploading image",{error});
    }
  }


