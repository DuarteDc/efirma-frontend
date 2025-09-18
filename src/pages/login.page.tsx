import { LoginForm } from '@/components/auth/login-form'

export const LoginPage = () => {
  return (
    <>
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
          <h1 className='signer-text text-9xl my-10'>Firma Electronica</h1>
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
    </>
  )
}
