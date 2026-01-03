import toast from 'react-hot-toast'

export const useToast = () => {
  const showSuccess = (message: string) => {
    toast.success(message, {
      ariaProps: {
        role: 'status',
        'aria-live': 'polite'
      },
      style: {
        background: '#10b981',
        color: '#fff'
      }
    })
  }

  const showError = (message: string) => {
    toast.error(message, {
      ariaProps: {
        role: 'alert',
        'aria-live': 'assertive'
      },
      style: {
        background: '#ef4444',
        color: '#fff'
      }
    })
  }

  const showInfo = (message: string) => {
    toast(message, {
      icon: 'ℹ️',
      ariaProps: {
        role: 'status',
        'aria-live': 'polite'
      },
      style: {
        background: '#363636',
        color: '#fff'
      }
    })
  }

  const showWarning = (message: string) => {
    toast(message, {
      icon: '⚠️',
      ariaProps: {
        role: 'status',
        'aria-live': 'polite'
      },
      style: {
        background: '#f59e0b',
        color: '#fff'
      }
    })
  }

  return {
    showSuccess,
    showError,
    showInfo,
    showWarning,
  }
}
