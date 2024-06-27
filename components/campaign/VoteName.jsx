import { useState } from "react";
import axios from "axios";
import Alert from "../notification/Alert";

const VoteName = ({ userId }) => {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null); // Reset error

        const votename = {
            name,
            description,
            userId
        }

        console.log(votename);
        try {
            const response = await axios.post('/api/campaigns/votename', votename);
            Alert.success("สําเร็จ", "เพิ่มชื่อมาสคอตเรียบร้อย", "success");
            setLoading(false);
            setName("");
            setDescription("");
        } catch (error) {
            console.error(error);
            if (error.response && error.response.data && error.response.data.message) {
                setError(error.response.data.message); // Set the error message
                setName(""); // Reset the name input
                setDescription(""); // Reset the description input
            } else {
                setError("An unexpected error occurred");
            }
            setLoading(false);
        }
    };

    return (
        <div>
            <div className="flex flex-col p-5 border-2 ml-4 mr-4 rounded-xl bg-white shadow-lg">
                <form className="flex flex-col p-2">
                    <label className="font-bold">คุณตั้งชื่อมาสคอตนี้ว่า:</label>
                    <input 
                        type="text" 
                        placeholder="ชื่อมาสคอต" 
                        className="border-2 rounded-xl mb-3 pl-2"
                        onChange={(e) => setName(e.target.value)} 
                    />
                    <label className="font-bold">คำอธิบาย/ความหมาย:</label>
                    <textarea 
                        type="text" 
                        rows="4" 
                        placeholder="คำอธิบาย/ความหมาย" 
                        className="border-2 rounded-xl pl-2"
                        onChange={(e) => setDescription(e.target.value)}
                    />
                    {error && <p className="text-red-500 mt-2">{error}</p>}
                    <div className="flex justify-center mt-5">
                        <button 
                            className="bg-[#F68B1F] text-white p-2 rounded-xl"
                            disabled={loading}
                            onClick={handleSubmit}
                        >
                            {loading ? "กําลังส่ง..." : "ส่งชื่อประกวด"}
                        </button>
                    </div>
                    
                </form>
            </div>
        </div>
    );
};

export default VoteName;
