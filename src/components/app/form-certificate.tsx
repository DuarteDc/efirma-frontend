import { useFormik } from 'formik'
import { CircleCheckIcon, KeyIcon, PdfIcon, UploadIcon } from '../icons'
import { useSign } from '../../hooks/use-sign'
import { useReadeFiles } from '../../hooks/use-reade-files'
import { LoadingScreen } from '../ui'
import { usePdf } from '../../hooks/use-pdf'

export const FormCertificate = () => {
  const { loading, startValidateDocument, startSignDocument } = useSign()
  const { parseCertificate, readAsBuffer } = useReadeFiles()
  const { editPDF } = usePdf()

  const formik = useFormik({
    initialValues: {
      archivoInput: null,
      crtInput: null,
      keyInput: null,
      passwordInput: ''
    },
    onSubmit: async () => {
      const cert = parseCertificate(await readAsBuffer(formik.values.crtInput!))
      await startSignDocument({ cert })
      editPDF(formik.values.archivoInput!)
    }
  })

  return (
    <>
      {loading && (
        <LoadingScreen message='Estamos validando tu certificado . . .' />
      )}
      <form className='mt-10' onSubmit={formik.handleSubmit}>
        <div className='grid grid-cols-1 md:grid-cols-4 lg:grid-cols-6 gap-6 auto-rows-fr max-w-[1500px] mx-auto'>
          <div className='md:col-span-2 lg:col-span-3 bg-white/5 backdrop-blur-xl border border-white/10 hover:border-white/20 transition-all duration-500 group overflow-hidden relative rounded-2xl'>
            <div className='absolute inset-0 bg-gradient-to-br from-red-950/20 to-red-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500'></div>
            <div className='relative p-8 h-full flex flex-col z-10'>
              <div className='flex items-center gap-4 mb-6'>
                <div className='w-12 h-12 bg-gradient-to-r from-red-900 to-red-600 rounded-xl flex items-center justify-center'>
                  <PdfIcon width={30} height={30} className='text-white' />
                </div>
                <div>
                  <h3 className='text-xl font-semibold text-white'>
                    Documento
                  </h3>
                  <p className='text-sm text-slate-400'>Archivo PDF a firmar</p>
                </div>
              </div>

              <div className='flex-1 relative' id='documentUpload'>
                <input
                  type='file'
                  accept='.pdf'
                  onChange={event => {
                    if (
                      !event.target.files ||
                      event.target.files?.length === 0
                    ) {
                      return
                    }
                    formik.setFieldValue('archivoInput', event.target.files[0])
                  }}
                  id='archivoInput'
                  name='archivoInput'
                  className='absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10'
                />
                <div
                  id='documentContent'
                  className={`h-full min-h-[200px] border-2 border-dashed ${
                    formik.values.archivoInput
                      ? 'border-green-400'
                      : 'border-slate-600'
                  } hover:border-purple-400 hover:bg-purple-400/5 rounded-2xl flex flex-col items-center justify-center transition-all duration-300`}
                >
                  {formik.values.archivoInput ? (
                    <>
                      <CircleCheckIcon
                        className='text-green-400'
                        width={50}
                        height={50}
                      />
                      <p className='text-white font-medium'>
                        {(formik.values.archivoInput as File).name}
                      </p>
                      <p className='text-green-400 text-sm mt-2'>
                        Archivo cargado
                      </p>
                    </>
                  ) : (
                    <>
                      <div className='w-16 h-16 border-2 border-dashed border-slate-600 rounded-xl flex items-center justify-center mb-4 text-white'>
                        <PdfIcon />
                      </div>
                      <p className='text-white font-medium'>
                        Haz clic para selecionar tu archivo
                      </p>
                    </>
                  )}
                </div>
              </div>
              <input
                type='text'
                className='hidden'
                id='oadText'
                name='oadText'
              />
            </div>
          </div>

          <div className='md:col-span-2 lg:col-span-1.5 bg-white/5 backdrop-blur-xl border border-white/10 hover:border-white/20 transition-all duration-500 group rounded-2xl'>
            <div className='absolute inset-0 bg-gradient-to-br from-blue-950/20 to-blue-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500'></div>
            <div className='p-6 h-full'>
              <div className='flex flex-col items-center text-center h-full'>
                <div className='w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center mb-4'>
                  <UploadIcon width={30} height={30} className='text-white' />
                </div>
                <h3 className='text-lg font-semibold text-white mb-2'>
                  Certificado
                </h3>
                <p className='text-sm text-slate-400 mb-4'>Archivo .cer</p>

                <div className='relative flex-1 w-full' id='certificateUpload'>
                  <input
                    type='file'
                    accept='.cer'
                    id='crtInput'
                    onChange={async event => {
                      if (
                        !event.target.files ||
                        event.target.files?.length === 0
                      ) {
                        return
                      }
                      const cert = parseCertificate(
                        await readAsBuffer(event.target.files[0])
                      )
                      const result = await startValidateDocument({ cert })
                      if (!result) return formik.setFieldValue('crtInput', null)
                      formik.setFieldValue('crtInput', event.target.files[0])
                    }}
                    name='crtInput'
                    className='absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10'
                  />
                  <div
                    id='certificateContent'
                    className={`h-full min-h-[120px] border-2 border-dashed ${
                      formik.values.crtInput
                        ? 'border-green-400'
                        : 'border-slate-600'
                    } hover:border-blue-400 rounded-xl flex items-center justify-center transition-all duration-300 text-white`}
                  >
                    {formik.values.crtInput ? (
                      <div className='flex flex-col items-center justify-center'>
                        <CircleCheckIcon
                          className='text-green-400'
                          width={45}
                          height={45}
                        />
                        <p className='text-white font-medium text-sm'>
                          {(formik.values.crtInput as File)!.name}
                        </p>
                        <p className='text-green-400 text-sm mt-2'>
                          Archivo cargado
                        </p>
                      </div>
                    ) : (
                      <UploadIcon width={35} height={35} />
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className='md:col-span-1 lg:col-span-1.5 bg-white/5 backdrop-blur-xl border border-white/10 hover:border-white/20 transition-all duration-500 group rounded-2xl'>
            <div className='absolute inset-0 bg-gradient-to-br from-orange-950/20 to-orange-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500'></div>
            <div className='p-6 h-full'>
              <div className='flex flex-col items-center text-center h-full'>
                <div className='w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center mb-4'>
                  <KeyIcon width={30} height={30} className='text-white' />
                </div>
                <h3 className='text-lg font-semibold text-white mb-2'>
                  Llave Privada
                </h3>
                <p className='text-sm text-slate-400 mb-4'>Archivo .key</p>

                <div className='relative flex-1 w-full' id='privateKeyUpload'>
                  <input
                    type='file'
                    accept='.key'
                    id='keyInput'
                    onChange={event => {
                      if (
                        !event.target.files ||
                        event.target.files?.length === 0
                      ) {
                        return
                      }
                      formik.setFieldValue('keyInput', event.target.files[0])
                    }}
                    name='keyInput'
                    className='absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10'
                  />
                  <div
                    id='privateKeyContent'
                    className={`h-full min-h-[120px] border-2 border-dashed ${
                      formik.values.keyInput
                        ? 'border-green-400'
                        : 'border-slate-600'
                    } hover:border-orange-400 rounded-xl flex items-center justify-center transition-all duration-300 text-white`}
                  >
                    {formik.values.keyInput ? (
                      <div className='flex flex-col items-center justify-center overflow-hidden'>
                        <CircleCheckIcon
                          className='text-green-400'
                          width={45}
                          height={45}
                        />
                        <p className='text-white font-medium text-xs truncate'>
                          {(formik.values.keyInput as File)!.name}
                        </p>
                        <p className='text-green-400 text-sm mt-2 truncate'>
                          Archivo cargado
                        </p>
                      </div>
                    ) : (
                      <KeyIcon width={35} height={35} />
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className='md:col-span-2 lg:col-span-2 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl'>
            <div className='p-6'>
              <h3 className='text-xl font-semibold text-white mb-6'>
                Estado del Proceso
              </h3>
              <div className='space-y-4'>
                <div className='flex items-center gap-3' id='documentStatus'>
                  <div
                    className={`status-dot w-3 h-3 rounded-full ${
                      formik.values.archivoInput
                        ? 'bg-green-400'
                        : 'bg-slate-600'
                    } transition-colors duration-300`}
                  ></div>
                  <span
                    className={`'text-xs ${
                      formik.values.archivoInput
                        ? 'text-green-400'
                        : 'text-slate-400'
                    } transition-colors duration-300'`}
                  >
                    Documento cargado
                  </span>
                </div>
                <div className='flex items-center gap-3' id='certificateStatus'>
                  <div
                    className={`status-dot w-3 h-3 rounded-full ${
                      formik.values.crtInput ? 'bg-green-400' : 'bg-slate-600'
                    } transition-colors duration-300`}
                  ></div>
                  <span
                    className={`'text-xs ${
                      formik.values.crtInput
                        ? 'text-green-400'
                        : 'text-slate-400'
                    } transition-colors duration-300'`}
                  >
                    Certificado cargado
                  </span>
                </div>
                <div className='flex items-center gap-3' id='privateKeyStatus'>
                  <div
                    className={`status-dot w-3 h-3 rounded-full ${
                      formik.values.keyInput ? 'bg-green-400' : 'bg-slate-600'
                    } transition-colors duration-300`}
                  ></div>
                  <span
                    className={`'text-xs ${
                      formik.values.keyInput
                        ? 'text-green-400'
                        : 'text-slate-400'
                    } transition-colors duration-300'`}
                  >
                    Llave privada cargada
                  </span>
                </div>
                <div className='flex items-center gap-3' id='passwordStatus'>
                  <div
                    className={`status-dot w-3 h-3 rounded-full ${
                      formik.values.passwordInput
                        ? 'bg-green-400'
                        : 'bg-slate-600'
                    } transition-colors duration-300`}
                  ></div>
                  <span
                    className={`'text-xs ${
                      formik.values.passwordInput
                        ? 'text-green-400'
                        : 'text-slate-400'
                    } transition-colors duration-300'`}
                  >
                    Contraseña ingresada
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className='p-8 md:col-span-4 lg:col-span-4 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl flex flex-col justify-between'>
            <div>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
                <div className='space-y-3'>
                  <label className='text-white font-medium block'>
                    RFC del Certificado
                  </label>
                  <input
                    type='text'
                    placeholder='Se extraerá automáticamente'
                    disabled
                    id='RFC'
                    className='w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-slate-400 placeholder:text-slate-500 cursor-not-allowed'
                  />
                </div>
                <div className='space-y-3'>
                  <label className='text-white font-medium block'>
                    Contraseña de la Llave Privada
                  </label>
                  <input
                    type='password'
                    placeholder='Ingresa tu contraseña'
                    id='passwordInput'
                    className='w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-slate-500 focus:border-[#a57f2c] focus:ring-2 focus:ring-[#a57f2c]/20 focus:outline-none transition-all duration-300'
                    onChange={formik.handleChange}
                    value={formik.values.passwordInput}
                  />
                </div>
              </div>
            </div>
            {formik.values.archivoInput &&
              formik.values.crtInput &&
              formik.values.keyInput &&
              formik.values.passwordInput && (
                <div className='flex justify-center items-center'>
                  <button
                    className='px-10 py-4 rounded-2xl text-white transition-all duration-500 hover:bg-blue-500 hover:scale-[1.03] bg-gradient-to-l cursor-pointer from-[#534015] to-[#a57f2c]'
                    type='submit'
                    name='firmar'
                    id='firmar'
                    onClick={() => console.log('e')}
                  >
                    Firmar Documento
                  </button>
                </div>
              )}
          </div>
        </div>
      </form>
    </>
  )
}
