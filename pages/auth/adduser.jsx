import { useForm } from "react-hook-form";
import useLine from "@/lib/hook/useLine";

export default function AddUser() {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const { logout, idTokens, accessTokens } = useLine();
    console.log('page addUser', 'idToken:', idTokens, 'accessToken:', accessTokens );

    const onSubmit = (data) => {
        console.log(data);
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)}>

            <input
                placeholder="รหัสพนักงาน"
                type="text" 
                {...register("empid", {
                    required: true,
                    maxLength: 10
                })} 
                
            />
            {errors.empid && <span>This field is required</span>}

            <input 
                placeholder="ชื่อ-นามสกุล"
                type="text" 
                {...register("fullname", {
                    required: true,
                    pattern: /^[ก-๏\s]+$/
                })} 
                
            />
            {errors.fullname && <span>This field is required</span>}

            <input 
                placeholder="เบอร์โทรศัพท์"
                type="phone" 
                {...register("phone", {
                    required: true
                })} 
                
            />
            {errors.phone && <span>This field is required</span>}

            <input 
                placeholder="ที่อยู่"
                type="text" 
                {...register("address", {
                    required: true
                })} 
                
            />
            {errors.address && <span>This field is required</span>}

            <input type="submit" value="Submit" onClick={handleSubmit(onSubmit)} />

        </form>
    );
   
}

