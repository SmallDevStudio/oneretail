export default class MyUploadAdapter {
    constructor(loader) {
      this.loader = loader;
      this.url = "https://api.cloudinary.com/v1_1/dxshvbc9c/image/upload"; // Replace YOUR_CLOUD_NAME
      this.preset = "v1x9mjbj"; // Replace YOUR_UPLOAD_PRESET
    }
  
    upload() {
      return this.loader.file.then(
        file =>
          new Promise((resolve, reject) => {
            const formData = new FormData();
            formData.append("file", file);
            formData.append("upload_preset", this.preset);
  
            fetch(this.url, {
              method: "POST",
              body: formData
            })
              .then(response => response.json())
              .then(result => {
                if (result.error) {
                  reject(result.error.message);
                } else {
                  resolve({
                    default: result.secure_url
                  });
                }
              })
              .catch(error => {
                reject("Upload failed");
              });
          })
      );
    }
  
    abort() {
      // Optional cleanup, if necessary
    }
  }