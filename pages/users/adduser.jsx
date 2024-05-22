import useLine from "@/lib/hook/useLine";
import { useState } from "react";
import Image from "next/image";
import axios from "axios";
import { redirect } from "next/navigation";
import { useForm } from "react-hook-form";

export default function AddUser(props) {
    const { status } = props
    const { profile } = useLine();
    const { userId, displayName, pictureUrl, statusMessage } = profile;
    const { register, handleSubmit } = useForm();
    const [formData, setFormData] = useState({});

    return (
        <form onSubmit={handleSubmit((data) => setFormData(JSON.stringify(data)))}>
            <input {...register("empid")} placeholder="empid" />
            <input {...register("name")} placeholder="name" />
            <input {...register("phone")} placeholder="phone" />
            <textarea {...register("address")} placeholder="address" />
            <input type="submit" />
            <p>{data}</p>
        </form>
    );
}

