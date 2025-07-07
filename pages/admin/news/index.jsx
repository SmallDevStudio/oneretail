import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import useSWR from "swr";
import Image from "next/image";
import moment from "moment";
import "moment/locale/th";
import { DataGrid } from "@mui/x-data-grid";
import Loading from "@/components/Loading";
import { IoIosArrowBack } from "react-icons/io";

moment.locale("th");

const fetcher = (url) => axios.get(url).then((res) => res.data);

export default function News() {
  const router = useRouter();
  const [news, setNews] = useState([]);
}
