import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import useSWR from "swr";
import axios from "axios";
import { AdminLayout } from "@/themes";
import SurveyTable from "@/components/admin/SurveyTable";
import Loading from "@/components/Loading";
import FormControlLabel from '@mui/material/FormControlLabel';
import IOSSwitch from "@/components/admin/IOSSwitch";

const fetcher = (url) => fetch(url).then((res) => res.json());

export default function Survey() {
    const { data: session, status } = useSession();
    const router = useRouter();

    const { data: surveySettings, error: surveySettingsError, mutate } = useSWR('/api/survey/settings', fetcher);
    const [isSurveyEnabled, setIsSurveyEnabled] = useState(false);

    useEffect(() => {
        if (surveySettings) {
            setIsSurveyEnabled(surveySettings.isSurveyEnabled);
        }
    }, [surveySettings]);

    if (status === "loading") return <Loading />;
    if (surveySettingsError) return <div>Error loading survey settings</div>;

    const handleSwitchChange = async (event) => {
        const newValue = event.target.checked;
        setIsSurveyEnabled(newValue);
    
        try {
          await axios.post('/api/survey/settings', { isSurveyEnabled: newValue });
          mutate(); // re-fetch the data to update the state
        } catch (error) {
          console.error('Error updating survey settings:', error);
        }
      };

    return (
        <div className="flex flex-col p-5 w-[100%]">
            <div className="mb-[-40px] ml-10">
                <h1 className="text-3xl font-bold text-[#0056FF]">Admin Survey Settings</h1>
                <FormControlLabel
                    control={
                    <IOSSwitch
                        sx={{ m: 1 }}
                        checked={isSurveyEnabled}
                        onChange={handleSwitchChange}
                    />
                    }
                    label="Enable Survey"
                />
            </div>
            <div className="p-5">
                <SurveyTable />
            </div>
            
        </div>
    );
}

Survey.getLayout = (page) => <AdminLayout>{page}</AdminLayout>;
Survey.auth = true;
