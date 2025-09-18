import type { ReactNode } from 'react'

export interface Props {
  children: ReactNode
}

export const MainLayout = ({ children }: Props) => {
  return (
    <section className=' min-h-screen text-white  relative overflow-hidden inset-0 main '>
      <div className='background absolute -z-20'></div>
      <img
        className='object-cover absolute top-1/2 right-0 transform  -translate-y-1/2 -z-10 rotate-360 animate__animated animate__fadeIn animate__delay-0.7s'
        src='/assets/main.png'
        alt='Imagen principal'
        width={700}
        height={700}
      />
      {children}
    </section>
  )
}
