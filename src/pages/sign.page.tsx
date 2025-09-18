import { FormCertificate } from '@/components/app/form-certificate'
import { Header } from '@/components/ui'
import { FloatingDock } from '@/components/ui/floating-dock'
import { IconFileInvoice, IconHome, IconLogout } from '@tabler/icons-react'

export const SignPage = () => {
  return (
    <>
      <Header />
      <FormCertificate />
      <div className='fixed bottom-3 z-50 mx-auto left-1/2 -translate-x-1/2'>
        <FloatingDock
          items={[
            {
              title: 'Inicio',
              href: '/sign',
              icon: <IconHome />
            },
            {
              title: 'Documentos',
              href: '/documents',
              icon: <IconFileInvoice />
            },
            {
              title: 'Salir',
              href: '',
              icon: <IconLogout />
            }
          ]}
        />
      </div>
    </>
  )
}
