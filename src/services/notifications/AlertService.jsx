// AlertService.js
import Swal from 'sweetalert2';

class AlertService {
    // Alert de succès simple
    static success(message, timer = 1500) {
        Swal.fire({
            title: message,
            text: 'Vous allez être redirigé...',
            icon: 'success',
            timer: 2000,
            showConfirmButton: false,
            background: '#fff',
            customClass: {
                popup: 'rounded-xl',
                title: 'text-xl font-bold text-gray-900',
                text: 'text-gray-600'
            }
        });
    }

    // Alert d'erreur simple
    static error(message) {
        return Swal.fire({
            icon: 'error',
            title: 'Erreur',
            text: message,
            confirmButtonColor: '#dc3545'
        });
    }

    // Alert d'information
    static info(message) {
        return Swal.fire({
            icon: 'info',
            title: 'Information',
            text: message,
            confirmButtonColor: '#17a2b8'
        });
    }

    // Alert d'avertissement
    static warning(message) {
        return Swal.fire({
            icon: 'warning',
            title: 'Attention',
            text: message,
            confirmButtonColor: '#ffc107'
        });
    }

    // Alert de confirmation
    static confirm(message, confirmText = 'Oui', cancelText = 'Non') {
        return Swal.fire({
            icon: 'question',
            title: 'Confirmation',
            text: message,
            showCancelButton: true,
            confirmButtonText: confirmText,
            cancelButtonText: cancelText,
            confirmButtonColor: '#28a745',
            cancelButtonColor: '#dc3545',
            reverseButtons: true
        });
    }

    // Alert avec timer auto-close
    static autoClose(message, timer = 2000) {
        return Swal.fire({
            icon: 'success',
            title: 'Succès',
            text: message,
            timer: timer,
            timerProgressBar: true,
            showConfirmButton: false
        });
    }

    // Alert avec input texte
    static prompt(message, defaultValue = '') {
        return Swal.fire({
            title: message,
            input: 'text',
            inputValue: defaultValue,
            showCancelButton: true,
            confirmButtonText: 'Valider',
            cancelButtonText: 'Annuler',
            inputValidator: (value) => {
                if (!value) {
                    return 'Vous devez écrire quelque chose!';
                }
            }
        });
    }

    // Alert personnalisée avec HTML
    static custom(options) {
        return Swal.fire(options);
    }

    // Toast notification (petit message en coin d'écran)
    static toast(message, type = 'success') {
        const Toast = Swal.mixin({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true
        });

        return Toast.fire({
            icon: type,
            title: message
        });
    }

    // Alert avec plusieurs étapes
    static async multiStep() {
        const steps = ['1', '2', '3'];
        const Queue = Swal.mixin({
            progressSteps: steps,
            confirmButtonText: 'Suivant',
            showClass: { backdrop: 'swal2-noanimation' },
            hideClass: { backdrop: 'swal2-noanimation' }
        });

        let currentStep;
        for (currentStep = 0; currentStep < steps.length;) {
            const result = await Queue.fire({
                title: `Étape ${steps[currentStep]}`,
                currentProgressStep: currentStep,
                showCancelButton: currentStep > 0,
                cancelButtonText: 'Retour'
            });

            if (result.isDismissed && result.dismiss === Swal.DismissReason.cancel) {
                currentStep--;
            } else {
                currentStep++;
            }
        }
    }
}

export default AlertService;