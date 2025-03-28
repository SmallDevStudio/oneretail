// pages/quizGame.js
import { useState } from 'react';
import { Provider } from 'react-redux';
import { Tabs, Tab, Box } from '@mui/material';
import store from '@/lib/redux/store';
import QuestionTable from '@/components/QuestionTable';
import AnswersTable from '@/components/admin/AnswersTable';
import QuizAdmin from '@/components/admin/QuizAdmin';
import UserQuizTable from '@/components/admin/UserQuizTable';
import Quiz2 from '@/components/games/quiz/Quiz2';
import { AdminLayout } from '@/themes';

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

export default function QuizGame() {
  const [tabIndex, setTabIndex] = useState(0);

  const handleTabChange = (event, newIndex) => {
    setTabIndex(newIndex);
  };

  return (
    <Provider store={store}>
      <div>
        <Tabs value={tabIndex} onChange={handleTabChange} aria-label="quiz game tabs" sx={{
          fontFamily: 'ttb',
        }}>
          <Tab label="จัดการคำถามใหม่" />
          <Tab label="AnswersByUser" />
          <Tab label="AnswersByQuestion" />
          
          
        </Tabs>
        <TabPanel value={tabIndex} index={0}>
          <Quiz2 />
        </TabPanel>
        <TabPanel value={tabIndex} index={2}>
          <AnswersTable />
        </TabPanel>
        <TabPanel value={tabIndex} index={1}>
          <UserQuizTable />
        </TabPanel>
        
      </div>
    </Provider>
  );
}

QuizGame.auth = true;
QuizGame.getLayout = (page) => <AdminLayout>{page}</AdminLayout>;
