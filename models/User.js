import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    name: {
         type: String,
          required: true 
        },
    email: { 
        type: String, 
        required: true, 
        unique: true 
    },
    password: { 
        type: String, 
        required: true
     },
     number: {
  type: String,
  required: true,
  unique: true, 
},
    role: {  
        type: String, 
        enum: ['Owner', 'Admin'], 
        default: 'Admin' },
    status: { 
        type: String, 
        enum: ['Active', 'Inactive'], 
        default: 'active' },
}, 
{ 
    timestamps: true

 }
);

export default mongoose.model('User', userSchema);
