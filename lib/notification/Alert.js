import Swal from 'sweetalert2'

export default class Alert {
    static success(message) {
        Swal.fire({
            icon: 'success',
            title: 'Success!',
            text: message
        })
    }

    static error(message) {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: message
        })
    }
}