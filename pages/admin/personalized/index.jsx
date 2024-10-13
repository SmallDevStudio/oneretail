import { useState, useEffect } from "react";
import ContentForm from "@/components/personalized/Form";
import { AdminLayout } from "@/themes";


const Personalized = () => {
   
    return (
       <div>
           <ContentForm />
       </div>
    );

};

export default Personalized;

Personalized.getLayout = (page) => <AdminLayout>{page}</AdminLayout>;
Personalized.auth = true;