import { Page, Document, StyleSheet } from '@react-pdf/renderer'
const styles = StyleSheet.create({
  page: {
    flexDirection: 'row'
  },
  section: {
    margin: 10,
    padding: 10,
    flexGrow: 1
  }
})

export const SignPdf = () => {
  return (
    <Document>
      <Page size='A4' style={styles.page}>
        <Text>HOJA DE FIRMANTES</Text>
      </Page>
    </Document>
  )
}
