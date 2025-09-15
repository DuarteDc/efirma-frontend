import { LoginForm } from '@/components/auth/login-form'

export const LoginPage = () => {
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
      <header>
        <img
          src='/assets/sspc.png'
          className='mask-sspc'
          alt='SSPC'
          width={400}
          height={400}
        />
      </header>
      <div className='grid items-center h-[calc(100vh-20rem)] grid-cols-2 p-20 gap-10'>
        <div className='grid'>
          <h1 className='signer-text text-9xl my-10'>Firma electronica</h1>
          <hr className='h-line' />
          <p className='text-2xl main-title'>
            E<b className='text-red-600'>-</b>firma
          </p>
          <div className='mt-5 gap-2'>
            <p>Sistema seguro de firma digital para documentos oficiales</p>
            <p className='text-xs'>
              © {new Date().getFullYear()} Gobierno de México
            </p>
          </div>
        </div>
        <div className='px-10'>
          <LoginForm />
        </div>
      </div>
    </section>
  )
}
