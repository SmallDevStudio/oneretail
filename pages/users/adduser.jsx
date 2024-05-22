import { useState } from "react"
import Head from "next/head"
import { Formik } from "formik"
import Image from "next/image";
import * as yup from "yup"

export default function AddUser() {
    const [image, setImage] = useState();
    const [error, setError] = useState(false);
    const [user, setUser] = useState({
        empid: "",
        name: "",
        phone: "",
        address: "",
        userid: "",
        pictureUrl: "",
        created_at: new Date(),
    });        

    function handleChangeImage(e) {
        console.log(e.target.files)
        setImage(URL.createObjectURL(e.target.files[0]));
    }

    function handleSubmit(e, setError, form, image, setUser) {
        e.preventDefault();
        setError(false);

        const formData = new FormData(e.target);
        formData.append("empid", empid);
        formData.append("name", name);
        formData.append("phone", phone);
        formData.append("address", address);
        formData.append("userid", userid);
        formData.append("created_at", created_at);

        if(image) {
            formData.append("pictureUrl", image);
        }

        fetch("/api/users/adduser", {
            method: "POST",
            body: formData
        })
        .then((res) => res.json())
        .then((data) => {
            setUser(data);
            console.log(data)
        })
        .catch((err) => {
            setError(true);
        })
    }

    const validationSchema = yup.object().shape({
        empid: yup.string().required("Required"),
        name: yup.string().required("Required"),
        phone: yup.string().max(10, "Must be 10 characters or less").required("Required"),
        address: yup.string().required("Required"),
        userid: yup.string().required("Required"),
    })

    return (
        <>
        <Head>
          <title>One Retail | Add User</title>
          <meta name="description" content="One Retail by TTB" />
        </Head>

        <h1>Add User</h1>

        <Formik 
            validationSchema={validationSchema}
            onSubmit={(values) => console.log(values)}
        >
            {(formDatas) => {
                <form onSubmit={formDatas.handleSubmit}>
                    <h2>Add Image:</h2>
                    <input type="file" onChange={handleChangeImage} value={image}/>
                    <Image 
                        src={image} 
                        alt="Profile Avatar"
                        width={200}
                        height={200}
                        quality={100}
                        className="rounded-full relative"
                        priority
                    />

                    <label htmlFor="empid">Employee ID</label>
                    <input type="text" id="empid" name="empid" onChange={formDatas.handleChange} value={formDatas.values.empid} />

                    <label htmlFor="name">Name</label>
                    <input type="text" id="name" name="name" onChange={formDatas.handleChange} value={formDatas.values.name} />

                    <label htmlFor="phone">Phone</label>
                    <input type="text" id="phone" name="phone" onChange={formDatas.handleChange} value={formDatas.values.phone} />

                    <label htmlFor="address">Address</label>
                    <input type="text" id="address" name="address" onChange={formDatas.handleChange} value={formDatas.values.address} />

                    <label htmlFor="userid">User ID</label>
                    <input type="text" id="userid" name="userid" onChange={formDatas.handleChange} value={formDatas.values.userid} />

                    <button type="submit">Submit</button>
                </form>
            }}
        </Formik>

        </>
    )
}