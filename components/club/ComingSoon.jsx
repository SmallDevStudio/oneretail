import Image from "next/image";

export default function ComingSoon() {
  return (
    <div className="flex w-full h-[80vh]">
      <div className="flex flex-col justify-center items-center w-full h-full">
        <Image
          src="/images/club/coming-soon.png"
          alt="coming-soon"
          width={200}
          height={200}
          className="object-contain"
        />
      </div>
    </div>
  );
}
