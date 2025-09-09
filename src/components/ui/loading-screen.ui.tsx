export const LoadingScreen = ({ message = 'Espere ...' }) => {
  return (
    <div
      id='loader'
      className='animate__animated animate__fadeIn absolute w-full z-50 top-0 flex flex-col gap-8 justify-center items-center min-h-svh bg-gradient-to-t from-black via-black/70 to-black/60'
    >
      <div className='loader'></div>
      <p className='text-white'>{message}</p>
    </div>
  )
}
