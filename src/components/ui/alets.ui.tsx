import { CircleCheckIcon, InfoIcon, XIcon } from '../icons'
import toast from 'react-hot-toast'

interface AlertProps {
  title?: string
  message: string
}

export function SuccessAlert ({ title = 'Success', message }: AlertProps) {
  return toast.custom(t => (
    <div className='relative rounded-xl border border-green-200 bg-green-50 p-4 shadow-sm'>
      <div className='flex items-start gap-3'>
        <div className='flex-shrink-0'>
          <CircleCheckIcon className='h-5 w-5 text-green-600' />
        </div>
        <div className='flex-1 min-w-0'>
          <h3 className='text-sm font-medium text-green-800'>{title}</h3>
          <p className='mt-1 text-sm text-green-700'>{message}</p>
        </div>

        <button
          onClick={() => toast.dismiss(t.id)}
          className='flex-shrink-0 rounded-lg p-1 text-green-400 hover:text-green-600 hover:bg-green-100 transition-colors'
        >
          <XIcon className='h-4 w-4' />
        </button>
      </div>
    </div>
  ))
}

export function ErrorAlert ({ title = 'Error', message }: AlertProps) {
  return toast.custom(t => (
    <div className='relative rounded-xl border border-red-200 bg-red-50 p-4 shadow-sm'>
      <div className='flex items-start gap-3'>
        <div className='flex-shrink-0'>
          <XIcon className='h-5 w-5 text-red-600' />
        </div>
        <div className='flex-1 min-w-0'>
          <h3 className='text-sm font-medium text-red-800'>{title}</h3>
          <p className='mt-1 text-sm text-red-700'>{message}</p>
        </div>

        <button
          onClick={() => toast.dismiss(t.id)}
          className='flex-shrink-0 rounded-lg p-1 text-red-400 hover:text-red-600 hover:bg-red-100 transition-colors'
        >
          <XIcon className='h-4 w-4' />
        </button>
      </div>
    </div>
  ))
}

export function InfoAlert ({ title = 'Information', message }: AlertProps) {
  return toast.custom(t => (
    <div className='relative rounded-xl border border-blue-200 bg-blue-50 p-4 shadow-sm'>
      <div className='flex items-start gap-3'>
        <div className='flex-shrink-0'>
          <InfoIcon className='h-5 w-5 text-blue-600' />
        </div>
        <div className='flex-1 min-w-0'>
          <h3 className='text-sm font-medium text-blue-800'>{title}</h3>
          <p className='mt-1 text-sm text-blue-700'>{message}</p>
        </div>

        <button
          onClick={() => toast.dismiss(t.id)}
          className='flex-shrink-0 rounded-lg p-1 text-blue-400 hover:text-blue-600 hover:bg-blue-100 transition-colors'
        >
          <XIcon className='h-4 w-4' />
        </button>
      </div>
    </div>
  ))
}
