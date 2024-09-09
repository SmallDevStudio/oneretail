import React from 'react';
import { AppLayout } from '@/themes';

const LearningGen = () => {

    return (
        <div>
            <div>
                <h1>LearningGen</h1>
            </div>
        </div>
    );
};

export default LearningGen;

LearningGen.getLayout = (page) => <AppLayout>{page}</AppLayout>;
LearningGen.auth = true;