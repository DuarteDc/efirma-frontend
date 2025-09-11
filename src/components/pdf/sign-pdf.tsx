import {
  Page,
  Document,
  StyleSheet,
  Text,
  View,
  Image
} from '@react-pdf/renderer'
import type { ValidateCertification } from '../../types/validate-certificate.definition'
import { useReadeFiles } from '../../hooks/use-reade-files'
import { chunkString } from '../../utils/chuckString'
import QRCode from 'qrcode'

import { useEffect, useState } from 'react'
import { formatDate } from '../../utils/format-date'
import { parseCustomDate } from '../../utils/parse-custom-date'
const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontSize: 10
  },
  title: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20
  },
  table: {
    display: 'flex',
    width: 'auto',
    borderStyle: 'solid',
    borderWidth: 1,
    borderRightWidth: 0,
    borderBottomWidth: 0
  },
  tableRow: {
    flexDirection: 'row'
  },
  tableCol: {
    borderStyle: 'solid',
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    padding: 2,
    flexGrow: 1
  },
  textTitle: {
    fontSize: 9,
    fontWeight: 600
  },
  text: {
    fontSize: 9
  },
  footer: {
    marginTop: 20,
    fontSize: 9
  },
  qr: {
    marginTop: 20,
    width: 120,
    height: 120,
    alignSelf: 'flex-end'
  }
})

interface Props {
  response: ValidateCertification
  file: File
  cert: ArrayBuffer
}

export const SignPdf = ({ response, file, cert }: Props) => {
  const { getMd5StringFromBlob, getCert } = useReadeFiles()
  const [qrData, setQrData] = useState<string | null>(null)

  useEffect(() => {
    const generateQR = async () => {
      const dataUrl = await QRCode.toDataURL('https://example.com', {
        scale: 10,
        margin: 1,
        maskPattern: 4
      }) // Aquí el contenido del QR
      setQrData(dataUrl)
    }
    generateQR()
  }, [])

  return (
    <Document>
      <Page size='A4' style={styles.page}>
        {/* Título */}
        <Text style={styles.title}>FIRMA ELECTRÓNICA</Text>
        <Text style={styles.textTitle}>Firma de documento</Text>
        <Text style={styles.textTitle}>Nombre del archivo: {file.name}</Text>
        <Text style={styles.textTitle}>
          Dependencia: Secretaria de Seguridad y Protección Ciudadana
        </Text>
        {/* Tabla */}
        <View style={styles.table}>
          {/* Encabezados */}
          <View style={styles.tableRow}>
            <View style={{ ...styles.tableCol, maxWidth: 100, width: 120 }}>
              <Text style={styles.textTitle}>Firmante</Text>
            </View>
            <View style={{ ...styles.tableCol, flexGrow: 4 }}>
              <Text style={styles.text}>{response.oData}</Text>
            </View>
          </View>
          <View style={styles.tableRow}>
            <View style={{ ...styles.tableCol, maxWidth: 100, width: 120 }}>
              <Text style={styles.textTitle}>RFC</Text>
            </View>
            <View style={{ ...styles.tableCol, flexGrow: 4 }}>
              <Text style={styles.text}>{response.rfc}</Text>
            </View>
          </View>

          <View style={styles.tableRow}>
            <View style={{ ...styles.tableCol, maxWidth: 100, width: 120 }}>
              <Text style={styles.textTitle}>Cadena del Documento</Text>
            </View>
            <View style={{ ...styles.tableCol, flexGrow: 4 }}>
              <Text style={styles.text}>{getMd5StringFromBlob(file)}</Text>
            </View>
          </View>
          <View style={styles.tableRow}>
            <View style={{ ...styles.tableCol, maxWidth: 100, width: 120 }}>
              <Text style={styles.textTitle}>Algoritmo</Text>
            </View>
            <View style={{ ...styles.tableCol, flexGrow: 4 }}>
              <Text style={styles.text}>RSA - SHA256</Text>
            </View>
          </View>
          <View style={styles.tableRow}>
            <View style={{ ...styles.tableCol, maxWidth: 100, width: 120 }}>
              <Text style={styles.textTitle}>Hora de firma del documento</Text>
            </View>
            <View style={{ ...styles.tableCol, flexGrow: 4 }}>
              <Text style={styles.text}>{formatDate('es-MX')}</Text>
            </View>
          </View>
          <View style={styles.tableRow}>
            <View style={{ ...styles.tableCol, maxWidth: 100, width: 120 }}>
              <Text style={styles.textTitle}>Certificado</Text>
            </View>
            <View style={{ ...styles.tableCol, flexGrow: 4 }}>
              <Text style={styles.text}>
                {chunkString(getCert(cert) ?? '', 70).map((line, i) => (
                  <Text key={i}>
                    {line}
                    {'\n'}
                  </Text>
                ))}
              </Text>
            </View>
          </View>
        </View>
        {/* Texto al pie */}
        <View style={styles.footer}>
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              gap: 4,
              alignItems: 'center'
            }}
          >
            <Text style={styles.textTitle}>Archivo firmado por:</Text>
            <Text style={styles.text}>{response.oData}</Text>
          </View>
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              gap: 4,
              alignItems: 'center'
            }}
          >
            <Text style={styles.textTitle}>Fecha de firma:</Text>
            <Text style={styles.text}>{formatDate('es-MX')}</Text>
          </View>
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              gap: 4,
              alignItems: 'center'
            }}
          >
            <Text style={styles.textTitle}>Vigencia del certificado:</Text>
            <Text style={styles.text}>
              {formatDate('es-MX', parseCustomDate(response.fechaFinal))}
            </Text>
          </View>
        </View>
        {/* QR */}
        {/* <Image style={styles.qr} src={'asdhilasdhashdjlk'} /> */}
        {qrData && <Image src={qrData} style={styles.qr} />}
      </Page>
    </Document>
  )
}
