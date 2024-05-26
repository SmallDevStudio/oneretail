import Image from "next/image"
import AppMenu from "@/components/menu/AppMenu"
export default function Redeem() {
    return (
        <main className="flex flex-col bg-white dark:bg-gray-900 mb-[50px]">
           
            <div className="w-full p-3">
                <div className="flex flex-col items-center justify-center">
                    <Image
                        src="/dist/img/logo-one-retail.png"
                        alt="Redeem"
                        width={170}
                        height={170}
                        priority
                        style={{
                            objectFit: "contain",
                        }}
                    />
                    <h1 className="text-3xl font-black text-[#1E3060] dark:text-white mt-4">
                        Redeem
                    </h1>
                </div>

                <div className="flex flex-col justify-center items-center w-full p-2">
                    <div className="flex flex-row row-span-2 bg-gray-300 rounded-xl w-full">
                        <div className="p-2 rounded-xl">
                            <Image
                                src="/dist/img/redeem/redeem_1.jpg"
                                alt="Redeem"
                                width={150}
                                height={150}
                                priority
                                style={{
                                    borderRadius: "10px",
                                }}
                            />
                        </div>

                        <div className="flex w-[250px] justify-center items-center pt-2">
                            <div className="flex flex-col p-1 justify-center items-center">
                                <div className="flex flex-col px-0 py-0 w-full">
                                    <h4 className="text-lg font-black text-black dark:text-white">
                                        lorem ipsum
                                    </h4>
                                    <span className="text-xs text-black dark:text-white">
                                        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                                    </span>
                                </div>

                                <div className="items-center justify-end">
                                    <button
                                        className="w-full px-4 py-1.5 bg-[#F68B1F] rounded-2xl text-white mt-1 mb-2"
                                    >
                                        Redeem
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col justify-center items-center w-full p-2">
                    <div className="flex flex-row bg-gray-300 rounded-xl w-full">
                        <div className="p-2 rounded-xl">
                            <Image
                                src="/dist/img/redeem/redeem_2.jpg"
                                alt="Redeem"
                                width={150}
                                height={150}
                                priority
                                style={{
                                    borderRadius: "10px",
                                }}
                            />
                        </div>

                        <div className="flex w-[250px] justify-center items-center pt-2">
                            <div className="flex flex-col p-1 justify-center items-center">
                                <div className="flex flex-col px-0 py-0 w-full">
                                    <h4 className="text-lg font-black text-black dark:text-white">
                                        lorem ipsum
                                    </h4>
                                    <span className="text-xs text-black dark:text-white">
                                        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                                    </span>
                                </div>

                                <div className="items-center justify-end">
                                    <button
                                        className="w-full px-4 py-1.5 bg-[#F68B1F] rounded-2xl text-white mt-1 mb-2"
                                    >
                                        Redeem
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col justify-center items-center w-full p-2">
                    <div className="flex flex-row row-span-2 bg-gray-300 rounded-xl w-full">
                        <div className="p-2 rounded-xl">
                            <Image
                                src="/dist/img/redeem/redeem_3.jpg"
                                alt="Redeem"
                                width={150}
                                height={150}
                                priority
                                style={{
                                    borderRadius: "10px",
                                }}
                            />
                        </div>

                        <div className="flex w-[250px] justify-center items-center pt-2">
                            <div className="flex flex-col p-1 justify-center items-center">
                                <div className="flex flex-col px-0 py-0 w-full">
                                    <h4 className="text-lg font-black text-black dark:text-white">
                                        lorem ipsum
                                    </h4>
                                    <span className="text-xs text-black dark:text-white">
                                        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                                    </span>
                                </div>

                                <div className="items-center justify-end">
                                    <button
                                        className="w-full px-4 py-1.5 bg-[#F68B1F] rounded-2xl text-white mt-1 mb-2"
                                    >
                                        Redeem
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col justify-center items-center p-2">
                    <div className="flex flex-row row-span-2 bg-gray-300 rounded-xl w-full">
                        <div className="p-2 rounded-xl">
                            <Image
                                src="/dist/img/redeem/redeem_4.jpg"
                                alt="Redeem"
                                width={150}
                                height={150}
                                priority
                                style={{
                                    borderRadius: "10px",
                                }}
                                className="object-cover rounded-xl"
                            />
                        </div>

                        <div className="flex w-[250px] justify-center items-center pt-2">
                            <div className="flex flex-col p-1 justify-center items-center w-full">
                                <div className="flex flex-col px-0 py-0 ">
                                    <h4 className="text-lg font-black text-black dark:text-white">
                                        lorem ipsum
                                    </h4>
                                    <span className="text-xs text-black dark:text-white">
                                        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                                    </span>
                                </div>

                                <div className="items-center justify-end">
                                    <button
                                        className="w-full px-4 py-1.5 bg-[#F68B1F] rounded-2xl text-white mt-1 mb-2"
                                    >
                                        Redeem
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
            <AppMenu />
        </main>
    )
}