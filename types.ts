export interface ImageFile {
  data: string; // Base64 string
  mimeType: string;
}

export interface GenerationState {
  isLoading: boolean;
  error: string | null;
  resultImage: string | null;
}

export enum AppStatus {
  IDLE = 'IDLE',
  UPLOADING = 'UPLOADING',
  READY_TO_EDIT = 'READY_TO_EDIT',
  PROCESSING = 'PROCESSING',
  COMPLETED = 'COMPLETED',
}