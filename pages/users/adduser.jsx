import useLine from "@/lib/hook/useLine";
import { useState } from "react";
import Image from "next/image";
import axios from "axios";
import { redirect } from "next/navigation";
export default function AddUser(props) {
    const { status } = props
    const { profile } = useLine();
    const { userId, displayName, pictureUrl, statusMessage } = profile;
    const [formData, setFormData] = useState({
        empId: '',
        name: '',
        phone: '',
        address: '',
        userId: userId,
        pictureUrl: pictureUrl,
        role: 'user',
        status: 'active',
        created_at: new Date(),
    });

    const handleChange = (event) => {
        event.preventDefault()
        const { name, value } = event.target
        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: value
        }));
    }

    const handleSubmit = () => {
        axios.post('/api/users/adduser', formData)
            .then((res) => {
                console.log(res);
                redirect('/')
            })
            .catch((err) => {
                console.log(err)
            });
    }

    


    if (status !== 'inited') {
        return (
            <div>
                <h1>
                    Register
                </h1>
                <hr />
                <button onClick={props.login}>Login</button>
            </div>
        );
    }
    return (
        <div>
            <h1>
                Register
            </h1>
            <hr />

            <form onSubmit={(formData) => console.log(formData)}>
                <Image
                    src={pictureUrl}
                    alt="Profile picture"
                    width={200}
                    height={200}
                    className="rounded-full"
                />
                <div>
                    <label>Employee ID</label>
                    <input type="text" id="empId" name="empId" onChange={handleChange} value={formData.empId} />
                </div>
                <div>
                    <label>Name</label>
                    <input type="text" id="name" name="name" onChange={handleChange} value={formData.name} />
                </div>
                <div>
                    <label>Phone</label>
                    <input type="text" id="phone" name="phone" onChange={handleChange} value={formData.phone} />
                </div>
                <div>
                    <label>Address</label>
                    <input type="text" id="address" name="address" onChange={handleChange} value={formData.address} />
                </div>
                
                <button type="submit">Register</button>
            </form>
        </div>
    );
}