import mongoose from "mongoose";

const libraryDeleteSchema = new mongoose.Schema({
    delete: [{
        contentId: {type: String},
        media: [{
            file_name: { type: String },
            public_id: { type: String },
            url: { type: String },
            type: { type: String }
        }],
    }] ,
    userId: { type: String, ref: 'Users', required: true },
    createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.LibraryDelete || mongoose.model('LibraryDelete', libraryDeleteSchema);