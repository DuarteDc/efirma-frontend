/* eslint-disable @typescript-eslint/no-unused-vars */
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import { Button } from '../ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '../ui/form'
import { Input } from '../ui/input'
import type z from 'zod'
import { LoginFormSchema } from '../schemas/login-form.schema'
import { UploadIcon } from '../icons'

export const LoginForm = () => {
  const form = useForm<z.infer<typeof LoginFormSchema>>({
    resolver: zodResolver(LoginFormSchema),
    defaultValues: {
      rfc: '',
      password: '',
      cert: undefined
    }
  })

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(() => {})}
        className='grid gap-6 p-10 backdrop-blur-xl border border-white/10 rounded-2xl bg-white/5 shadow-2xl'
      >
        <h2 className='text-center text-4xl font-bold'>Iniciar Sesión</h2>
        <p className='text-sm text-center font-bold text-gray-400'>
          Ingresa tu RFC, contraseña y certificado digital para firmar
          documentos
        </p>
        <FormField
          control={form.control}
          name='rfc'
          render={({ field }) => (
            <FormItem>
              <FormLabel>RFC (Registro Federal de Contribuyentes)</FormLabel>
              <FormControl>
                <Input
                  placeholder='AAAA######AAA'
                  {...field}
                  className={` h-14 bg-black/20 focus:ring-red-600 focus:ring-2 rounded-xl focus:border-transparent transition-all uppercase`}
                  autoComplete='off'
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='password'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Contraseña del Certificado</FormLabel>
              <FormControl>
                <Input
                  placeholder='••••••••'
                  {...field}
                  type='password'
                  className='h-14 bg-black/20 focus:ring-red-600 focus:ring-2 rounded-xl focus:border-transparent transition-all'
                  autoComplete='off'
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='cert'
          render={({ field: { value, onChange, ...fieldProps } }) => (
            <FormItem>
              <FormLabel>Certificado Digital</FormLabel>
              <FormControl>
                <div className='relative'>
                  <Input
                    id='certificate'
                    {...{ ...fieldProps }}
                    type='file'
                    accept='.cer,.cert,.p12,.pfx'
                    className='hidden'
                    onChange={event =>
                      onChange(event.target.files && event.target.files[0])
                    }
                  />
                  <label
                    htmlFor='certificate'
                    className={`flex items-center justify-center rounded-xl w-full h-14 bg-black/20 px-3 py-2 border border-border cursor-pointer transition-all hover:bg-accent/10`}
                  >
                    <UploadIcon className='h-4 w-4 mr-2 text-white' />
                    <span className='text-sm text-white'>
                      {form.getValues().cert
                        ? form.getValues().cert.name
                        : 'Seleccionar certificado'}
                    </span>
                  </label>
                  {/* {certificate && (
                <div className="flex items-center mt-1 text-sm text-accent">
                  <Shield className="h-3 w-3 mr-1" />
                  Certificado cargado correctamente
                </div>
              )} */}
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button className='py-6 rounded-xl font-bold cursor-pointer hover:scale-[1.01] transition-all duration-300'>
          Iniciar sesión
        </Button>
        <div className='mt-6 text-center text-sm'>
          <span className='text-gray-300'>¿No tienes una cuenta? </span>
          <a
            href='#'
            className='text-white hover:text-white/60 font-medium transition-colors'
          >
            Regístrate aquí
          </a>
        </div>
      </form>
    </Form>
  )
}
