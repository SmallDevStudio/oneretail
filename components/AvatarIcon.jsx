import Image from "next/image";

const AvatarIcon = ({ src, alt }) => {
    return (
        <div className="w-12 h-12 rounded-full overflow-hidden">
            <Image
                src={src}
                alt={alt}
                width={40}
                height={40}
                className="w-full h-full object-cover"
            />
        </div>
    );
};