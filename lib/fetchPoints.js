import Swal from 'sweetalert2';

const fetchPoints = async (userId) => {
  try {
    const response = await fetch('/api/loginreward', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId,
        description: 'Login Reward',
        type: 'earn',
      }),
    });

    const data = await response.json();

    if (response.ok) {
      Swal.fire({
        title: 'WELCOME LOGIN',
        text: `You have received ${data.points} points`,
        icon: 'success',
        confirmButtonText: 'OK',
      }).then(() => {
        window.location.href = '/main';
      });
    } else {
      Swal.fire({
        title: 'Error',
        text: data.error,
        icon: 'error',
        confirmButtonText: 'OK',
      });
    }
  } catch (error) {
    Swal.fire({
      title: 'Error',
      text: 'An unexpected error occurred',
      icon: 'error',
      confirmButtonText: 'OK',
    });
  }
};

export default fetchPoints;