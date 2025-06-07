import { useState, useEffect } from "react";
import Image from "next/image";
import axios from "axios";
import useSWR from "swr";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import ReactPlayer from "react-player";
import moment from "moment";
import "moment/locale/th";
import Swal from "sweetalert2";
import { IoIosArrowBack } from "react-icons/io";
import { toast } from "react-toastify";
import Loading from "../Loading";
import { IoMdHome } from "react-icons/io";

moment.locale("th");

const fetcher = (url) => axios.get(url).then((res) => res.data);

export default function View({ data, onClose }) {
  const [answers, setAnswers] = useState([]);
  const [hasAnswered, setHasAnswered] = useState(false);
  const [isSubmit, setIsSubmit] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const { data: session } = useSession();
  const userId = session?.user?.id;
  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    if (!data) return;
  }, [data]);

  const { data: answersData } = useSWR(
    `/api/forms/answers?formId=${id}&userId=${userId}`,
    fetcher
  );

  useEffect(() => {
    if (answersData && answersData.data.length > 0) {
      setHasAnswered(true);
      Swal.fire({
        icon: "warning",
        title: "คุณทำได้ทำ Form แล้ว",
        confirmButtonText: "กลับไปหน้าหลัก",
      }).then((result) => {
        if (result.isConfirmed) {
          router.push("/main");
        }
      });
    }
  }, [answersData, router]);

  const handleFieldChange = (e, field, index) => {
    const { value } = e.target;

    setAnswers((prevAnswers) => {
      const updatedAnswers = [...prevAnswers];
      const existingAnswerIndex = updatedAnswers.findIndex(
        (answer) => answer.index === index + 1
      );

      if (existingAnswerIndex !== -1) {
        // อัปเดตค่าคำตอบของคำถามที่มีอยู่
        updatedAnswers[existingAnswerIndex] = {
          index: index + 1,
          fieldId: field._id, // ใช้ `_id` ของคำถามเพื่อเชื่อมโยงข้อมูล
          answer: value,
        };
      } else {
        // เพิ่มคำตอบใหม่เข้าไปใน array
        updatedAnswers.push({
          index: index + 1,
          fieldId: field._id,
          answer: value,
        });
      }

      setErrors((prevErrors) => {
        const newErrors = { ...prevErrors };
        delete newErrors[index + 1];
        return newErrors;
      });

      return updatedAnswers;
    });
  };

  const handleSubmit = async () => {
    setLoading(true);

    if (hasAnswered) {
      setLoading(false);
      await Swal.fire({
        icon: "warning",
        title: "คําเตือน",
        text: "คุณได้ตอบคําถามแล้ว",
        confirmButtonText: "ตกลง",
        confirmButtonColor: "#0056FF",
        allowOutsideClick: false,
      });
      setAnswers([]);
      return;
    }

    // ตรวจสอบว่ามีคำถามที่ไม่ได้ตอบหรือไม่
    const newErrors = {};
    data.fields.forEach((field, index) => {
      const answer =
        answers.find((ans) => ans.index === index + 1)?.answer || "";
      if (answer === "") {
        newErrors[index + 1] = "กรุณาเลือกคำตอบ";
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast.error("คุณตอบคำถามยังไม่ครบทุกข้อ");
      setLoading(false);
      return;
    }

    if (answers.length < data.fields.length) {
      toast.error("คุณตอบคำถามยังไม่ครบทุกข้อ");
      setLoading(false);
      return;
    }

    const newAnswers = {
      formId: data._id,
      answers,
      userId,
    };

    try {
      const response = await axios.post("/api/forms/answers", newAnswers);
      if (response.status === 201) {
        Swal.fire({
          icon: "success",
          title: "Success",
          text: "บันทึกข้อมูลเรียบร้อยแล้ว",
          confirmButtonText: "ตกลง",
          confirmButtonColor: "#0056FF",
          allowOutsideClick: false,
        }).then(() => {
          setLoading(false);
          handleClear();
          router.back();
        });
      }
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  const handleClear = () => {
    setAnswers([]);
    setErrors({});
    setIsSubmit(false);
    setHasAnswered(false);
    onClose();
  };

  if (loading) return <Loading />;

  return (
    <main className="flex flex-col w-full bg-[#0056FF] min-h-[100vh] pb-20">
      <div className="flex flex-row bg-[#0056FF] w-full h-10 items-center">
        <IoIosArrowBack
          className="text-xl inline text-white"
          onClick={handleClear}
          size={25}
        />
        <span className="text-xl font-bold text-white ml-2">
          One Retail Forms
        </span>
      </div>

      <div className="w-full bg-white">
        {data?.image && (
          <Image
            src={data.image.url}
            alt={data.title}
            width={500}
            height={500}
          />
        )}
        {data?.youtube && (
          <ReactPlayer
            url={data.youtube.url + "&modestbranding=1&rel=0"}
            controls
            width="100%"
            height="250px"
            playing={true}
          />
        )}
      </div>
      <div className="w-full px-2 py-4 bg-white rounded-b-sm">
        <h1 className="text-xl font-bold text-[#0056FF]">{data.title}</h1>
        <p className="text-md">{data.description}</p>
      </div>
      <div className="w-full">
        {data &&
          data?.fields?.map((field, index) => (
            <div
              key={index}
              className="flex flex-col w-full mt-2 bg-white px-4 py-2 rounded-sm"
            >
              <h1 className="text-xl font-bold">
                {index + 1}. {field.title}
              </h1>
              <p className="text-md text-gray-400">{field.description}</p>
              {field.image && (
                <div className="flex mt-2">
                  <Image
                    src={field.image.url}
                    alt={field.title}
                    width={500}
                    height={500}
                    style={{ width: "auto", height: "100%" }}
                  />
                </div>
              )}
              {field.youtube && (
                <div className="flex mt-2">
                  <ReactPlayer
                    url={field.youtube.url + "&modestbranding=1&rel=0"}
                    controls
                    width="100%"
                    height="250px"
                    playing={false}
                  />
                </div>
              )}
              {field.type === "option" && errors[index + 1] && (
                <p className="text-red-500 text-sm mt-1">{errors[index + 1]}</p>
              )}
              <div>
                {field.type === "text" ? (
                  <div>
                    <textarea
                      className={`w-full mt-2 border-2 p-2 rounded-lg
                        ${errors[index + 1] ? "border-red-500" : ""}
                        `}
                      name="text"
                      placeholder="กรอกข้อมูล"
                      value={
                        answers.find((answer) => answer.index === index + 1)
                          ?.answer || ""
                      }
                      onChange={(e) => handleFieldChange(e, field, index)}
                      rows={3}
                    />
                  </div>
                ) : (
                  <div className="mt-2 px-2.5">
                    {field.options.map((option, optIndex) => (
                      <div key={optIndex} className="flex flex-row gap-2">
                        <input
                          type="radio"
                          id={`${field._id}-${option}`} // ให้ id มีเอกลักษณ์
                          name={`option-${field._id}`} // ให้แต่ละ field มี name แยกกัน
                          value={option}
                          checked={
                            answers.find((ans) => ans.fieldId === field._id)
                              ?.answer === option
                          }
                          onChange={(e) => handleFieldChange(e, field, index)}
                        />
                        <label htmlFor={`${field._id}-${option}`}>
                          {option}
                        </label>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        <div className="flex justify-center items-centerw-full mt-4">
          {hasAnswered ? (
            <button
              type="submit"
              className="bg-[#F2871F] text-white font-bold py-2 px-4 rounded-full"
              onClick={() => router.back()}
            >
              <div className="flex flex-row items-center gap-2">
                <IoMdHome size={20} />
                กลับไปหน้าแรก
              </div>
            </button>
          ) : (
            <button
              type="submit"
              className="bg-[#F2871F] text-white font-bold py-2 px-4 rounded-full"
              onClick={handleSubmit}
              disabled={hasAnswered}
            >
              Submit
            </button>
          )}
        </div>
      </div>
    </main>
  );
}
