export interface Certification {
  id: string | null;
  certificateName: string;
  issuer: string;
  code: string;
  issueDate: string;
  expiryDate: string;
  certificateLink: string;
  isContinuing: boolean;
}

export interface CertificationPayload {
  id: string | null,
  name: string;
  issuer: string;
  code: string;
  issueMonth: string;
  issueYear: number;
  expiryMonth: string | null;
  expiryYear: number | null;
  certificateLink: string;
  isOngoing: boolean;
}

export const initialCertificationListState: Certification[] = [
  {
    id: null,
    certificateName: "",
    issuer: "",
    code: "",
    issueDate: "",
    expiryDate: "",
    certificateLink: "",
    isContinuing: false,
  },
];
