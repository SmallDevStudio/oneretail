import MyUploadAdapter from "./CustomUploadAdapter";

export const editorConfiguration = {
    extraPlugins: [MyUploadAdapter],
    toolbar: [
        'heading', '|',
        'fontSize', 'bold', 'italic', 'link', 'bulletedList', 'numberedList', '|',
        'outdent', 'indent', '|',
         'fontColor', 'fontBackgroundColor',
        'imageUpload', 'blockQuote', 'insertTable', 'mediaEmbed', 'undo', 'redo', '|',
        'cloudServices'
    ],
    fontSize: {
        options: [
            9, 11, 13, 'default', 17, 19, 21
        ],
        supportAllValues: false // Set to true if you want to allow custom font sizes
    },
    fontColor: {
        colors: [
            {
                color: '#0056FF',
                label: 'Hot Blue'
            },
            {
                color: '#F68B1F',
                label: 'Hot Orange'
            }
            // Add more colors here
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
            }
            // Add more colors here
        ]
    },
    cloudServices: {
        cloudinary: {
            // Add Cloudinary credentials here
            cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
        }
    },
    upload
    // Add more configuration options here
};
