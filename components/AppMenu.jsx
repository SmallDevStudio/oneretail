import OneRetailIcon from "@/resources/icons/OneRetailIcon";
import LeaderIcon from "@/resources/icons/LeaderIcon";
import Link from "next/link";

export default function AppMenu() {
    return (
        <div className="fixed bottom-0 left-0 z-50 w-full h-16 bg-white border-t border-gray-200 dark:bg-gray-700 dark:border-gray-600 shadow-lg">
            <div className="grid h-full max-w-lg grid-cols-5 mx-auto font-medium">
                
                    <button type="button" className="inline-flex flex-col items-center justify-center px-5 hover:bg-gray-50 dark:hover:bg-gray-800 group" 
                        onClick={() => window.location.href = "/learning"}
                        >
                        <svg className="w-7 h-7 mb-1  group-hover:text-blue-600 dark:group-hover:text-blue-500 group-hover:w-9 group-hover:h-9" aria-hidden="true"  xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75 15.75v-1.5" />
                        </svg>
                        <span className="text-sm  group-hover:text-blue-600 dark:group-hover:text-blue-500 text-nowrap">Learning</span>
                    </button>


                    <button type="button" className="inline-flex flex-col items-center justify-center px-5 hover:bg-gray-50 dark:hover:bg-gray-800 group"
                        onClick={() => window.location.href = "/stores"}
                    >
                        <svg className="ww-7 h-7 mb-1  group-hover:text-blue-600 dark:group-hover:text-blue-500 group-hover:w-9 group-hover:h-9" aria-hidden="true"  xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75h-9m9 0a3 3 0 0 1 3 3h-15a3 3 0 0 1 3-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 0 1-.982-3.172M9.497 14.25a7.454 7.454 0 0 0 .981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 0 0 7.73 9.728M5.25 4.236V4.5c0 2.108.966 3.99 2.48 5.228M5.25 4.236V2.721C7.456 2.41 9.71 2.25 12 2.25c2.291 0 4.545.16 6.75.47v1.516M7.73 9.728a6.726 6.726 0 0 0 2.748 1.35m8.272-6.842V4.5c0 2.108-.966 3.99-2.48 5.228m2.48-5.492a46.32 46.32 0 0 1 2.916.52 6.003 6.003 0 0 1-5.395 4.972m0 0a6.726 6.726 0 0 1-2.749 1.35m0 0a6.772 6.772 0 0 1-3.044 0" />
                        </svg>
                        <span className="text-sm group-hover:text-blue-600 dark:group-hover:text-blue-500 text-nowrap">Sucess Story</span>
                    </button>



                    <button type="button" className="inline-flex flex-col items-center justify-center px-5 hover:bg-gray-50 dark:hover:bg-gray-800 group"
                        onClick={() => window.location.href = "/main"}
                    >
                        <svg className="w-7 h-7 mb-1  group-hover:text-blue-600 dark:group-hover:text-blue-500 group-hover:w-9 group-hover:h-9" aria-hidden="true"  xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
                        </svg>
                        <span className="text-sm  group-hover:text-blue-600 dark:group-hover:text-blue-500 text-nowrap">Home</span>
                    </button>



                    <button type="button" className="inline-flex flex-col items-center justify-center px-5 hover:bg-gray-50 dark:hover:bg-gray-800 group"
                        onClick={() => window.location.href = "/club"}
                    >
                        <OneRetailIcon className="w-6 h-6 mb-1 group-hover:text-blue-600 dark:group-hover:text-blue-500 group-hover:w-9 group-hover:h-9" />
                        <span class="text-sm  group-hover:text-blue-600 dark:group-hover:text-blue-500 text-nowrap">One Retail Club</span>
                    </button>



                    <button type="button" className="inline-flex flex-col items-center justify-center px-5 hover:bg-gray-50 dark:hover:bg-gray-800 group"
                        onClick={() => window.location.href = "/profile"}
                    >
                        <svg className="w-7 h-7 mb-1  group-hover:text-blue-600 dark:group-hover:text-blue-500 group-hover:w-9 group-hover:h-9" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                        </svg>

                        <span className="text-sm  group-hover:text-blue-600 dark:group-hover:text-blue-500 text-nowrap">Profile</span>
                </button>

            </div>
        </div>
    )
}

