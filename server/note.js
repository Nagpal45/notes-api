import mongoose from 'mongoose';

const noteSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        minLength: 3,
        maxLength: 255
    },
    content: {
        type: String,
        required: true,
        minLength: 6
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
},
{
    timestamps: true
});

const Note = mongoose.model('Note', noteSchema);
export default Note;