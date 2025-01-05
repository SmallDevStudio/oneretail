import React, { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import useSWR from "swr";
import Form from "@/components/courses/form";
import { AppLayout } from "@/themes";
import Loading from "@/components/Loading";


const fetcher = url => axios.get(url).then(res => res.data);

const Suggestions = () => {
    const [courses, setCourses] = useState([]);
    const [suggestions, setSuggestions] = useState([]);
    const [questionnaires, setQuestionnaires] = useState([]);
    const [rating, setRating] = useState(0);
    const [loading, setLoading] = useState(false);
    const [hasQuestionnaire, setHasQuestionnaire] = useState(false);

    const router = useRouter();
    const { id } = router.query;
    const { data: session, status } = useSession();
    
    const { data, error } = useSWR(`/api/courses/ratings?id=${id}`, fetcher, {
        onSuccess: (data) => {
            setCourses(data.data);
            setQuestionnaires(data.questionnaires);
            setRating(data.rating);
            setSuggestions(data.suggestions);
        },
    });

    useEffect(() => {
            if (questionnaires) {
                const hasQuestionnaire = questionnaires.some(questionnaire => questionnaire.userId === session.user.id);
                setHasQuestionnaire(hasQuestionnaire);
            }
    }, [questionnaires, session.user.id] );

    useEffect(() => {
        if (hasQuestionnaire) {
            router.push(`/courses/${id}`);
        }
    }, [hasQuestionnaire, id, router]);

    if (!data) return <Loading />;
    if (error) return <div>failed to load</div>;

    console.log(courses);

    const handleCloseForm = () => {
        router.push("/courses/" + id);
    };

    return (
        <div className="flex flex-col p-2 pb-10 w-full">
            <Form 
                course={courses}
                handleCloseForm={handleCloseForm}
            />
        </div>
    );
};

export default Suggestions;

Suggestions.getLayout = page => <AppLayout>{page}</AppLayout>;
Suggestions.auth = true;