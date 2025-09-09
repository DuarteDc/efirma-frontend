import type { Icon } from './props.icon.definition'

export const XIcon: Icon = ({ width = 25, height = 25, ...props }) => {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      viewBox='0 0 24 24'
      width={width}
      height={height}
      {...props}
      fill={'none'}
    >
      <path
        d='M18 6L6.00081 17.9992M17.9992 18L6 6.00085'
        stroke='#141B34'
        strokeWidth='1.5'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
    </svg>
  )
}
