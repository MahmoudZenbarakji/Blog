const User = require("../models/user.model")

exports.createUser = async (req,res) => {
    try{
        const {name,lastname,email,username,password,birthDate} = req.body
        if(!name || !lastname || !email || !username || !password || !birthDate){
            return res.status(400).json({
                status:"fail",
                message:"All fields are required"
            })
        }
        const user = await User.create({name,lastname,email,username,password,birthDate})
        res.status(201).json({
            status:"success",
            data:user
        })
    }catch(error){
        console.log(error)
        res.status.json({
            status:"error",
            message:error.message
        })
    }
}

exports.getUser = async(req,res)=>{
    try{
        const user =  await User.find()
        res.status(200).json({
            status:"success",
            data:user
        })
    }catch(error){
        console.log(error)
        res.status(500).json({
            status:"error",
            message:error.message
        })
    }
}

exports.getUserById = async (req,res)=>{
    try{
        const {id} = req.params
            if (!mongoose.Types.ObjectId.isValid(id)) {
              return res.status(400).json({
                status: 'fail',
                message: 'Invalid ID'
              });
            }
        const user = await User.findById(id)
        if(!user){
            return res.status(404).json({
                status:"fail",
                message:"User not found"
            })
        }
        res.status(200).json({
            status:"success",
            data:user
        })
    }catch(error){
        res.status(500).json({
            status:"error",
            message:error.message
        })
    }
}



exports.updateUser = async (req,res)=>{
    try{
        const {id} = req.params
        const updateData = req.body
        const user = await User.findByIdAndUpdate(id,updateData)
        if(!user){
            return res.status(404).json({
                status:"fail",
                message:"User not found"
            })
        }
        res.status(200).json({
            status:"success",
            data:user
        })
    }catch(error){
        res.status(500).json({
            status:"error",
            message:error.message
        })
    }
}
