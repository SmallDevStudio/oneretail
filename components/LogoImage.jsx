import Image from "next/image";

const LogoImage = (src, alt, width, height) => {
    return (
        <div className="flex justify-center items-center">
            <Image
                src={src}
                alt={alt}
                width={width}
                height={height}
                priority
            />
        </div>
    );
};

export default LogoImage;