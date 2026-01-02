import toast from 'react-hot-toast'

export const useToast = () => {
  const showSuccess = (message: string) => {
    toast.success(message, {
      ariaProps: {
        role: 'alert',
        'aria-live': 'assertive'
      },
    })
  }

  const showError = (message: string) => {
    toast.error(message, {
      ariaProps: {
        role: 'alert',
        'aria-live': 'assertive'
      },
    })
  }

  const showInfo = (message: string) => {
    toast(message, {
      icon: 'ℹ️',
      ariaProps: {
        role: 'status',
        'aria-live': 'polite'
      },
    })
  }

  const showWarning = (message: string) => {
    toast(message, {
      icon: '⚠️',
      style: {
        background: '#f59e0b',
        color: '#fff',
      },
      ariaProps: {
        role: 'alert',
        'aria-live': 'assertive'
      },
    })
  }

  return {
    showSuccess,
    showError,
    showInfo,
    showWarning,
  }
}