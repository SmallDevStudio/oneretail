import { useState } from "react";
import axios from "axios";
import useSWR from "swr";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import CourseForm from "@/components/courses/CourseForm";
import CourseTable from "@/components/courses/CourseTable";
import Header from "@/components/admin/global/Header";
import { AdminLayout } from "@/themes";
import Loading from "@/components/Loading";
import Report from "@/components/courses/Report";
import Modal from "@/components/Modal";

const fetcher = (url) => axios.get(url).then((res) => res.data);

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [showReport, setShowReport] = useState(false);

  const router = useRouter();
  const { data: session } = useSession();

  const { data, error, mutate, isLoading } = useSWR(
    "/api/courses/admin",
    fetcher,
    {
      onSuccess: (data) => {
        setCourses(data.data);
      },
    }
  );

  const handleShowForm = () => {
    setShowForm(!showForm);
  };

  const handleShowReport = () => {
    setShowReport(!showReport);
  };

  const handleCloseReport = () => {
    setShowReport(false);
    setSelectedCourse(null);
  };

  if (isLoading) return <Loading />;
  if (error) return <div>Failed to load</div>;

  return (
    <div className="flex flex-col w-full">
      <Header
        title="จัดการคอร์ส"
        subtitle="จัดการข้อมูลคอร์ส เพิ่มคอร์ส ลบคอร์ส แก้ไขคอร์ส"
      />
      <div className="flex flex-col px-5 mt-2 mb-5">
        <div className="flex flex-row justify-between items-center gap-2 mb-2 w-full">
          <button
            onClick={() => {
              handleShowForm();
              setIsEditing(false);
            }}
            className="text-white bg-[#0056FF] rounded-lg px-4 py-2 text-sm font-bold"
          >
            เพิ่มคอร์ส
          </button>
        </div>
        <CourseTable
          courses={courses}
          mutate={mutate}
          setIsEditing={setIsEditing}
          setSelectedCourse={setSelectedCourse}
          selectedCourse={selectedCourse}
          handleShowForm={handleShowForm}
          handleShowReport={handleShowReport}
        />
      </div>
      {showForm && (
        <CourseForm
          mutate={mutate}
          userId={session?.user?.id}
          editData={selectedCourse}
          isEditing={isEditing}
          setIsEditing={setIsEditing}
          handleShowForm={handleShowForm}
          setSelectedCourse={setSelectedCourse}
        />
      )}
      {showReport && (
        <Modal open={showReport} onClose={handleCloseReport}>
          <Report course={selectedCourse} />
        </Modal>
      )}
    </div>
  );
};

export default Courses;

Courses.getLayout = (page) => <AdminLayout>{page}</AdminLayout>;
Courses.auth = true;
