import {
  Page,
  Document,
  StyleSheet,
  Text,
  View,
  Image
} from '@react-pdf/renderer'
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
    padding: 4,
    flexGrow: 1
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
    width: 100,
    height: 100,
    alignSelf: 'flex-end'
  }
})

export const SignPdf = () => {
  return (
    <Document>
      <Page size='A4' style={styles.page}>
        {/* Título */}
        <Text style={styles.title}>HOJA DE FIRMANTES</Text>

        {/* Tabla */}
        <View style={styles.table}>
          {/* Encabezados */}
          <View style={styles.tableRow}>
            <View style={styles.tableCol}>
              <Text style={styles.text}>Firmante</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.text}>Nombre</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.text}>Validez</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.text}>Revocación</Text>
            </View>
          </View>

          {/* Filas */}
          <View style={styles.tableRow}>
            <View style={styles.tableCol}>
              <Text style={styles.text}>Firma #Serie</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.text}>CINDY GONZALEZ PIÑA</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.text}>Vigente</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.text}>No Revocado</Text>
            </View>
          </View>

          <View style={styles.tableRow}>
            <View style={styles.tableCol}>
              <Text style={styles.text}>Fecha</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.text}>30/04/24 20:49:08</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.text}>Status OK</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.text}>Válida</Text>
            </View>
          </View>

          <View style={styles.tableRow}>
            <View style={styles.tableCol}>
              <Text style={styles.text}>Algoritmo</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.text}>RSA - SHA256</Text>
            </View>
            <View style={styles.tableCol}></View>
            <View style={styles.tableCol}></View>
          </View>
        </View>

        {/* Texto al pie */}
        <Text style={styles.footer}>
          Archivo firmado por: CINDY GONZALEZ PIÑA{'\n'}
          Serie: 50.4A.45.44...38{'\n'}
          Fecha de firma: 30/04/24 20:49:08{'\n'}
          Certificado vigente: 14/04/25
        </Text>

        {/* QR */}
        <Image style={styles.qr} src={'asdhilasdhashdjlk'} />
      </Page>
    </Document>
  )
}
