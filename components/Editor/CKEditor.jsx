// components/CKEditor.js
import React from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@/lib/ckeditor5-build-classic';
import MyUploadAdapter from './CustomUploadAdapter';

const editorConfiguration = {
  extraPlugins: [MyCustomUploadAdapterPlugin],
  toolbar: [
    'heading', '|',
    'fontSize', 'bold', 'italic', 'link', 'bulletedList', 'numberedList', '|',
    'outdent', 'indent', '|',
    'imageUpload', 'blockQuote', 'insertTable', 'mediaEmbed', 'undo', 'redo', '|',
    'fontColor', 'fontBackgroundColor'
  ],
  fontColor: {
    colors: [
      {
        color: '#0056FF',
        label: 'Hot Blue'
      },
      {
        color: '#F68B1F',
        label: 'Hot Orange'
      },
      // You can add more colors here
    ]
  },
  fontBackgroundColor: {
    colors: [
      {
        color: '#0056FF',
        label: 'Hot Blue'
      },
      {
        color: '#F68B1F',
        label: 'Hot Orange'
      },
      // You can add more colors here
    ]
  }
};

function MyCustomUploadAdapterPlugin(editor) {
  editor.plugins.get('FileRepository').createUploadAdapter = (loader) => {
    return new MyUploadAdapter(loader);
  };
}

function CustomEditor({ data, onChange }) {
  return (
    <CKEditor
      editor={ClassicEditor}
      config={editorConfiguration}
      data={data}
      onChange={(event, editor) => {
        const data = editor.getData();
        onChange(data);
      }}
      style={{ minHeight: '300px' }} // Initial height
    />
  );
}

export default CustomEditor;
