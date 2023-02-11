const toastSwal = async (icon, text = "") => {
    if(icon != "success" && icon != "error" && icon != "warning" && icon != "info" && icon != "question") return false;

    const Toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        didOpen: (toast) => {
            toast.addEventListener('mouseenter', Swal.stopTimer)
            toast.addEventListener('mouseleave', Swal.resumeTimer)
        }
    })
      
    Toast.fire({
        icon: icon /*'success'*/,
        html: text
    })
}

const alertSweetTimer = (message = '') => {
    let timerInterval;
    
    Swal.fire({
        title: "Loading process...!",
        html: message,
        showConfirmButton: false,
        allowOutsideClick: false,
        allowEnterKey: false,
        allowEscapeKey: false,
        stopKeydownPropagation: true,
        didOpen: () => {
            Swal.showLoading(Swal.getDenyButton())
        },
        willClose: () => {
            clearInterval(timerInterval)
        }
    });
}