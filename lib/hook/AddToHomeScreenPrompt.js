import React from 'react';
import { AddToHomeScreen } from 'react-pwa-add-to-homescreen';

const AddToHomeScreenPrompt = () => {
  return (
    <AddToHomeScreen
      appId="your-app-id"
      startDelay={0}
      lifespan={15}
      displayPace={1440}
      customPromptContent={{
        title: 'Add to Home Screen',
        cancelMsg: 'Cancel',
        installMsg: 'Install',
      }}
    />
  );
};

export default AddToHomeScreenPrompt;
