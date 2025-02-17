import mongoose from "mongoose";

const MediaLibrarySchema = new mongoose.Schema({

});

export default mongoose.models.MediaLibrary || mongoose.model('MediaLibrary', MediaLibrarySchema);