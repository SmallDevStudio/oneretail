import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import axios from 'axios';
import Alert from '@/lib/notification/Alert';
export default function RemoveBtn({ id }) {
    const removePage = async () => {
        const confirmed = confirm('คุณต้องการลบหน้านี้หรือไม่?');

        if (confirmed) {
            try {
                await axios.delete(`/api/contents/${id}`);
                window.location.reload();
            } catch (error) {
                console.error(error);
            }
        }
    }

    return (
        <button onClick={removePage} className="btn btn-sm btn-error" >
            <DeleteOutlinedIcon />
        </button>
    );
}