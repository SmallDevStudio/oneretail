import React from "react";
import useSWR from "swr";
import { useDispatch } from "react-redux";
import { fetchUserStart, fetchUserSuccess, fetchUserError } from "@/lib/redux/userSlice";

const fetcher = (url) => fetch(url).then((res) => res.json());

const useFetchUser = (userId) => {
    const dispatch = useDispatch();

    const { data, error } = useSWR(userId ? `/api/users/${userId}` : null, fetcher, {
        onError: (error) => {
          dispatch(fetchUserFailure(error.message));
        },
        onSuccess: (data) => {
          dispatch(fetchUserSuccess(data));
        },
      });

    React.useEffect(() => {
        if (userId) {
            dispatch(fetchUserStart());
        }
    }, [userId, dispatch]);

    return {
        user: data,
        isLoading: !error && !data,
        isError: error
    };
};

export default useFetchUser;