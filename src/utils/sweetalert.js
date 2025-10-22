    import Swal from 'sweetalert2';

    // Configuración personalizada de SweetAlert2 para Duck'n Roll
    export const Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
    toast.addEventListener('mouseenter', Swal.stopTimer);
    toast.addEventListener('mouseleave', Swal.resumeTimer);
    }
    });

    // Alerta de éxito
    export const showSuccess = (title, text = '') => {
    return Swal.fire({
    icon: 'success',
    title: title,
    text: text,
    confirmButtonColor: '#FFD700', // Amarillo pato
    confirmButtonText: 'Genial!',
    background: '#FFFFFF',
    color: '#000000',
    });
    };

    // Alerta de error
    export const showError = (title, text = '') => {
    return Swal.fire({
    icon: 'error',
    title: title,
    text: text,
    confirmButtonColor: '#FFD700',
    confirmButtonText: 'Entendido',
    background: '#FFFFFF',
    color: '#000000',
    });
    };

    // Alerta de confirmación
    export const showConfirm = (title, text = '') => {
    return Swal.fire({
    icon: 'warning',
    title: title,
    text: text,
    showCancelButton: true,
    confirmButtonColor: '#FFD700',
    cancelButtonColor: '#4A4A4A',
    confirmButtonText: 'Sí, confirmar',
    cancelButtonText: 'Cancelar',
    background: '#FFFFFF',
    color: '#000000',
    });
    };

    // Toast de éxito (notificación pequeña)
    export const toastSuccess = (message) => {
    return Toast.fire({
    icon: 'success',
    title: message,
    background: '#FFD700',
    color: '#000000',
    });
    };

    // Toast de error
    export const toastError = (message) => {
    return Toast.fire({
    icon: 'error',
    title: message,
    background: '#FF6B6B',
    color: '#FFFFFF',
    });
    };

    // Toast de info
    export const toastInfo = (message) => {
    return Toast.fire({
    icon: 'info',
    title: message,
    background: '#4A4A4A',
    color: '#FFFFFF',
    });
    };

    export default Swal;