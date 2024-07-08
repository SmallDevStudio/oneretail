import React from "react";
import Image from "next/image";

const Rules = () => {
    return (
        <div className="flex flex-col w-full text-sm mb-20 text-white p-2">
            <h1 className="text-md font-bold text-[#0056FF]">One Retail Club คืออะไร?</h1>
            <p className="text-sm">One Retail Club คือ คลับที่รวบรวมคนเก่งของบ้าน Retail และ AL พร้อมจัดเต็มสิทธิประโยชน์แบบ Exclusive ต่างๆ มากมายแบบไม่เคยเป็นมาก่อน เช่น </p>
            <ul className="text-sm list-item list-disc ml-4 mt-2 mb-2">
                <li>ทริป <span className="font-bold text-[#F68B1F]">“สุดปัง”</span> เติมพลังประจำปี ทั้งในและต่างประเทศ</li>
                <li>กิจกรรมพัฒนาตัวเอง <span className="font-bold text-[#F68B1F]">“สุดคูล”</span> เฉพาะคนพิเศษเท่านั้น</li>
                <li>ปาร์ตี้ <span className="font-bold text-[#F68B1F]">“สุดฉ่ำ”</span> สนุกแบบสุดเหวี่ยง</li>
                <li>ของรางวัล <span className="font-bold text-[#F68B1F]">“สุดเก๋”</span> ที่เตรียมให้เฉพาะคุณคนเดียว</li>
                <li>ที่สำคัญ คลับนี้จะปั้นคุณให้เป็น Role Model ที่ใครๆ ต่างก็อยากนำไปเป็นแบบอย่างในการทำงาน”</li>
            </ul>
            <Image
                src="/images/club/content-1.png"
                alt="content-1"
                width={200}
                height={200}
                style={{
                    objectFit: "cover",
                    objectPosition: "center",
                    height: "auto",
                    width: "auto",
                }}
            />
            <p className="mt-2 font-bold text-[#0056FF]">จะเป็นหนึ่งในสมาชิก One Retail Club ได้อย่างไร?</p>
            <p>เราจะวัดผลงาน Year to Date Performance ทุกสิ้นเดือน มีนาคม - ตุลาคม 2567 โดยพนักงานที่มีผลงานระดับ <span className="font-bold text-[#F68B1F]">“E : Excellence”</span> ทุกคน จะได้เข้าร่วมคลับโดยอัตโนมัติ  โดยสิทธิประโยชน์ต่างๆ จะแตกต่างกันตามระดับของสมาชิก ซึ่งจะต้องรักษาผลงานของตัวเองอย่างสม่ำเสมอ เพื่อคงสถานภาพสมาชิกของตัวเองเอาไว้ จะได้ไม่เสียใจที่หลุดออกจากคลับ!!!</p>
            <p className="mt-2 font-bold text-[#0056FF]">สมาชิก One Retail Club แบ่งออกเป็นกี่ประเภท?</p>
            <p className="mb-4">สมาชิก One Retail Club แบ่งออกเป็น 4 ประเภทดังนี้</p>
            <div className="flex flex-row justify-between items-center">
            <Image
               src="/images/club/badge/Ambassador.png"
                alt="Ambassador"
                width={60}
                height={60}
                style={{
                    objectFit: "cover",
                    objectPosition: "center",
                    height: "60px",
                    width: "60px",
                }}
            />
            <Image
               src="/images/club/badge/diamond.png"
                alt="diamond"
                width={60}
                height={60}
                style={{
                    objectFit: "cover",
                    objectPosition: "center",
                    height: "60px",
                    width: "60px",
                }}
            />
             <Image
               src="/images/club/badge/Platinum.png"
                alt="Platinum"
                width={60}
                height={60}
                style={{
                    objectFit: "cover",
                    objectPosition: "center",
                    height: "60px",
                    width: "60px",
                }}
            />
            <Image
               src="/images/club/badge/gold.png"
                alt="gold"
                width={60}
                height={60}
                style={{
                    objectFit: "cover",
                    objectPosition: "center",
                    height: "60px",
                    width: "60px",
                }}
            />
            </div>
            <p className="mt-4 mb-4">ซึ่งแต่ละประเภท จะได้รับสิทธิประโยชน์แตกต่างกัน โดยพนักงานในตำแหน่งต่างๆ จะถูกจัดอันดับเพื่อแบ่งประเภทสมาชิก ดังนี้</p>
            <Image
                src="/images/club/Asset3.png"
                alt="Table-1"
                width={400}
                height={150}
                style={{
                    objectFit: "cover",
                    objectPosition: "center",
                    height: "auto",
                    width: "auto",
                }}
            />
            <p className="mt-4"><span className="text-red-500">*</span> เฉพาะสมาชิกระดับ Ambassador ต้องปฏิบัติงานในตำแหน่งนั้นๆ มากกว่า 6 เดือนขึ้นไปเท่านั้น</p>
            <p><span className="text-red-500">**</span> อันดับและประเภทของสมาชิก จะเปลี่ยนแปลงเมื่อผล Year to Date Performanceในแต่ละเดือน ถูกประกาศออกไป</p>
            <p><span className="text-red-500">***</span> สมาชิกต้องเข้าร่วมกิจกรรมที่จัดให้ทุกครั้งเพื่อดำรงสถานะและสิทธิประโยชน์ต่างๆ</p>

            <p className="mt-4 mb-2 font-bold text-[#0056FF]">สิทธิประโยชน์ของสมาชิกแต่ละประเภท</p>
            <Image
                src="/images/club/Asset4.png"
                alt="Table-2"
                width={400}
                height={120}
                style={{
                    objectFit: "cover",
                    objectPosition: "center",
                    height: "auto",
                    width: "auto",
                }}
            />
            <p className="mt-4 mb-2 font-bold text-[#F68B1F]">สำหรับ Retail</p>
            <Image
                src="/images/club/Asset1.png"
                alt="content-5"
                width={400}
                height={400}
                style={{
                    objectFit: "cover",
                    objectPosition: "center",
                    height: "auto",
                    width: "auto",
                }}
            />
            <p className="mt-4 mb-2 font-bold text-[#F68B1F]">สำหรับ AL</p>
            <Image
                src="/images/club/Asset2.png"
                alt="content-6"
                width={400}
                height={400}
                style={{
                    objectFit: "cover",
                    objectPosition: "center",
                    height: "auto",
                    width: "auto",
                }}
            />
        </div>
    );
};

export default Rules;