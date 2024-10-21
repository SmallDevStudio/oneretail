import mongoose from "mongoose";

const useFormsSchema = new mongoose.Schema({
    formId: { type: mongoose.Schema.Types.ObjectId, ref: 'Forms', required: true },
    answers: [{
        index: { type: Number },
        text: { type: String },
        option: { type: String }
    }],
    userId: { type: String, ref: 'Users', required: true },
    createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.UseForms || mongoose.model('UseForms', useFormsSchema)