import UploadedDocuments from "../types";

export type Props = {
    uploadedDocuments: UploadedDocuments;
    handleDocumentUpload: (documentType: keyof UploadedDocuments) => void;
    documentType: keyof UploadedDocuments;
    label: string;
    expiryDate?: string | any;
    needExpiryDate?: boolean | any;
    onPressDate?: (slug: keyof UploadedDocuments) => void;
};