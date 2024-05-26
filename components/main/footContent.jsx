import Image from "next/image";
export default function FooterContant() {
    return (
        <div className="w-full flex justify-center items-center mt-10">
            <Image
                src="/dist/img/footcontant.png"
                alt="Footer Contant"
                width={500}
                height={500}
            />
        </div>
    );
}