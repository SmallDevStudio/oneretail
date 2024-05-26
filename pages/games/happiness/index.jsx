import SentimentVeryDissatisfiedOutlinedIcon from '@mui/icons-material/SentimentVeryDissatisfiedOutlined';
import SentimentDissatisfiedOutlinedIcon from '@mui/icons-material/SentimentDissatisfiedOutlined';
import SentimentNeutralOutlinedIcon from '@mui/icons-material/SentimentNeutralOutlined';
import SentimentSatisfiedAltOutlinedIcon from '@mui/icons-material/SentimentSatisfiedAltOutlined';
import SentimentVerySatisfiedOutlinedIcon from '@mui/icons-material/SentimentVerySatisfiedOutlined';
export default function happinesstemp() {
    return (
        <main className="flex flex-col items-center justify-center bg-[#0056FF]" style={{ height: "100vh" }}>
            <div className="bg-white rounded-3xl" style={{ height: "90%", width: "80%" }}>
                <div className="p-10 items-center justify-center">
                    <div className="text-center mt-10">
                        <span className="text-3xl text-bold font-black text-[#0056FF]" >อุณภูมิ</span>
                        <span className="text-3xl text-bold font-black text-[#F68B1F]">ความสุข</span>
                    </div>

                    <div>
                        <p className="text-xs font-extrabold mt-10">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Consequat mauris nunc congue nisi vitae suscipit tellus mauris.
                        </p>
                    </div>

                    <form>
                        <div className="m-5">
                            <ul className="grid w-full gap-2">
                                <li>
                                    <input type="checkbox" id="temp-option1" value="" className="peer hidden" required="" />
                                    <label for="temp-option1" className="inline-flex items-center w-full p-2 text-white bg-[#FF0000] rounded-2xl cursor-pointer peer-checked:border-blue-600 peer-checked:text-blue-600 hover:text-[#FF0000] hover:bg-gray-100">
                                        <div className="relative flex items-center gap-2">
                                            <SentimentVeryDissatisfiedOutlinedIcon 
                                                className='w-10 h-10'
                                            />
                                            <div className="w-full text-lf font-semibold">Lorem ipsum</div>
                                        </div>
                                    </label>
                                </li>

                                <li>
                                    <input type="checkbox" id="temp-option2" value="" className="peer hidden" required="" />
                                    <label for="temp-option2" className="inline-flex items-center w-full p-2 text-white bg-[#FF8A00] rounded-2xl cursor-pointer peer-checked:border-blue-600 peer-checked:text-blue-600 hover:text-[#FF8A00] hover:bg-gray-100">
                                        <div className="relative flex items-center gap-2">
                                            <SentimentDissatisfiedOutlinedIcon 
                                                className='w-10 h-10'
                                            />
                                            <div className="w-full text-lf font-semibold">Lorem ipsum</div>
                                        </div>
                                    </label>
                                </li>

                                <li>
                                    <input type="checkbox" id="temp-option3" value="" className="peer hidden" required="" />
                                    <label for="temp-option3" className="inline-flex items-center w-full p-2 text-white bg-[#FFC700] rounded-2xl cursor-pointer peer-checked:border-blue-600 peer-checked:text-blue-600 hover:text-[#FFC700] hover:bg-gray-100">
                                        <div className="relative flex items-center gap-2">
                                            <SentimentNeutralOutlinedIcon 
                                                className='w-10 h-10'
                                            />
                                            <div className="w-full text-lf font-semibold">Lorem ipsum</div>
                                        </div>
                                    </label>
                                </li>

                                <li>
                                    <input type="checkbox" id="temp-option4" value="" className="peer hidden" required="" />
                                    <label for="temp-option4" className="inline-flex items-center w-full p-2 text-white bg-[#FFD600] rounded-2xl cursor-pointer peer-checked:border-blue-600 peer-checked:text-blue-600 hover:text-[#FFD600] hover:bg-gray-100">
                                        <div className="relative flex items-center gap-2">
                                            <SentimentSatisfiedAltOutlinedIcon 
                                                className='w-10 h-10'
                                            />
                                            <div className="w-full text-lf font-semibold">Lorem ipsum</div>
                                        </div>
                                    </label>
                                </li>

                                <li>
                                    <input type="checkbox" id="temp-option5" value="" className="peer hidden" required="" />
                                    <label for="temp-option5" className="inline-flex items-center w-full p-2 text-white bg-[#00D655] rounded-2xl cursor-pointer peer-checked:bg-[#0056FF] peer-checked:text-[#0056FF] hover:text-[#00D655] hover:bg-gray-100">
                                        <div className="relative flex items-center gap-2">
                                            <SentimentVerySatisfiedOutlinedIcon 
                                                className='w-10 h-10'
                                            />
                                            <div className="w-full text-lf font-semibold">Lorem ipsum</div>
                                        </div>
                                    </label>
                                </li>
                            </ul>
                        </div>
                        <div>
                           
                            <label for="message" className="block mb-1 text-m font-black text-gray-900 dark:text-white">Lorem ipsum dolor sit amet</label>
                            <textarea 
                                id="message" 
                                rows="4" 
                                className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                                placeholder="Write your thoughts here...">
                            </textarea>
 
                        </div>
                        <div className='flex justify-center text-center'>
                            <button type="submit" className="w-[50%] bg-[#F68B1F] text-white p-3 rounded-3xl mt-3 cursor-pointer hover:bg-orange-300">
                                <span className='font-bold text-xl'>
                                    Send
                                </span>
                            </button>
                        </div>
                    </form>
                </div>
            </div>
            
        </main>
    )
}