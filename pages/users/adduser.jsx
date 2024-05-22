import { useState } from "react";
import { useForm } from "react-hook-form";

export default function AddUser(props) {
    const { register, handleSubmit } = useForm();
    const [formData, setFormData] = useState({});

    return (
        <form onSubmit={handleSubmit((formData) => setFormData(JSON.stringify(formData)))}>
            <input {...register("empid")} placeholder="empid" />
            <input {...register("name")} placeholder="name" />
            <input {...register("phone")} placeholder="phone" />
            <textarea {...register("address")} placeholder="address" />
            <input type="submit" />
            <p>{formData}</p>
        </form>
    );
}

