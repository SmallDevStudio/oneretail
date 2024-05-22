import { useState } from "react";
import { useForm } from "react-hook-form";

export default function AddUser() {
    const { register, handleSubmit } = useForm();
    const [data, setData] = useState("");

    const onSubmit = (data) => setData(data);

    console.log(JSON.stringify(data));

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <input {...register("empid")} placeholder="empid" />
            <input {...register("name")} placeholder="name" />
            <input {...register("phone")} placeholder="phone" />
            <textarea {...register("address")} placeholder="address" />
            <input type="submit" />
            <p>{data}</p>
        </form>
    );
}

