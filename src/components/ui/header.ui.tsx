export const Header = () => {
  return (
    <>
      <div className='background absolute -z-20'></div>
      <img
        className='object-cover absolute top-1/2 right-0 transform  -translate-y-1/2 -z-10 rotate-360 animate__animated animate__fadeIn animate__delay-0.7s'
        src='/assets/main.png'
        alt='Imagen principal'
        width={500}
        height={500}
      />
      <header
        className='bg-transparent min-h-[10rem] max-h-[10rem] relative flex overflow-hidden
        justify-center md:justify-between items-center px-5'
      >
        <img
          src='/assets/header.png'
          alt='header'
          width={250}
          height={250}
          className='drop-shadow-2xl fade-in mask animate__animated animate__fadeIn hidden md:block w-[10rem] md:w-[8rem] lg:w-[15rem]'
        />
        <div className='text-white'>
          <h1 className='text-3xl lg:text-5xl text-center animate__animated animate__zoomIn'>
            Firma Digital
          </h1>
          <span className='text-center text-xs md:text-sm animate__animated animate__fadeIn'>
            Autenticación avanzada para documentos digitales
          </span>
        </div>
        <img
          src='/assets/sspc.png'
          alt='header'
          width={350}
          height={350}
          className='drop-shadow-2xl fade-in animate__animated animate__fadeIn w-[13rem] hidden md:block lg:w-[19rem]'
        />
      </header>
    </>
  )
}
