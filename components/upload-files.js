import React, { Component } from "react";
import UploadFileService from "@/services/file-upload-service";

export default class UploadFileService extends Component {
    constructor(props) {
        super(props);

        this.state = {
            currentFile: undefined,
            previewImage: undefined,
            progress: 0,

            message: "",
            isError: false,
            imageInfo: []
        }
        selectFile(event) {
            this.setState({
                currentFile: event.target.files[0],
                previewImage: URL.createObjectURL(event.target.files[0]),
                progress: 0,
                message: "",
            });
        }
        upload() {
            this.setState({
              progress: 0
            });
        
            UploadFileService.upload(this.state.currentFile, (event) => {
              this.setState({
                progress: Math.round((100 * event.loaded) / event.total),
              });
            })
              .then((response) => {
                this.setState({
                  message: response.data.message,
                  isError: false
                });
                return UploadFileService.getFiles();
              })
              .then((files) => {
                this.setState({
                  imageInfos: files.data,
                });
              })
              .catch((err) => {
                this.setState({
                  progress: 0,
                  message: "Could not upload the image!",
                  currentFile: undefined,
                  isError: true
                });
              });
        }
        this.componentDidMount = () => {
            UploadFileService.getFiles().then((response) => {
              this.setState({
                imageInfos: response.data,
              });
            })
            .catch((err) => {
              console.log(err);
            });
        }
    }

    render() {

    }
}