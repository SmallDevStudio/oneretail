import Image from "next/image";

const LogoImage = () => {
    return (
        <div className="flex justify-center items-center">
            <Image
                src="/dist/img/logo-one-retail.png"
                alt="one-retail logo"
                width={200}
                height={200}
            />
        </div>
    );
};

export default LogoImage;