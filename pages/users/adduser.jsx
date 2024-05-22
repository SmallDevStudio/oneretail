import { useState } from "react";

export default function AddUser() {
    const [data, setData] = useState("");

    const handleChange = (event) => {
        const { name, value } = event.target;

        setData({
            ...data,
            [name]: value
        });

    }

    const handleSubmit = (event) => {
        event.preventDefault();

        console.log(data);
    }
    

    console.log(data);

    return (
        <form onSubmit={handleSubmit}>

            <input type="text" name="empid" value={data.event.target} onChange={handleChange} placeholder="รหัสพนักงาน"/>
            <input type="text" name="name" value={data.event.target} onChange={handleChange} placeholder="ชื่อ-นามสกุล"/>
            <input type="text" name="phone" value={data.event.target} onChange={handleChange} placeholder="เบอร์โทรศัพท์"/>
            <textarea type="text" name="address" value={data.event.target} onChange={handleChange} placeholder="ที่อยู่"/>

            <input type="submit" value="Submit" className="btn btn-primary" />
        </form>
        
    );
}

