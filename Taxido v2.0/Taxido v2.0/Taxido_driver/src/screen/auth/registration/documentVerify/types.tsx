import { DocumentPickerResponse } from 'react-native-document-picker'

type UploadedDocuments = {
  birthCertificate: DocumentPickerResponse | null
  registrationCertificate: DocumentPickerResponse | null
  drivingLicense: DocumentPickerResponse | null
  nationalIdProof: DocumentPickerResponse | null
  panCard: DocumentPickerResponse | null
}

export default UploadedDocuments
