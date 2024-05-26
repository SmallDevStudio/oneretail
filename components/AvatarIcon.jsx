import Image from "next/image";

const AvatarIcon = ({ src, alt, width, height }) => {
    return (
        <div className="flex w-20 h-20 overflow-hidden">
            <Image
                src={src}
                alt={alt}
                width={width}
                height={height}
                className="object-cover rounded-full "
            />
        </div>
    );
};

export default AvatarIcon;