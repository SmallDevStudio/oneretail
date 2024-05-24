import Image from "next/image";

const AvatarImage = ({ src, alt, width, height }) => {
    return (
        <div className="flex rounded-full overflow-hidden border-2 border-[#0056FF]">
            <Image
                src={src}
                alt={alt}
                width={width}
                height={width}
            />
        </div>
    );
};

export default AvatarImage;