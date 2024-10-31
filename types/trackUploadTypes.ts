export interface FileUploadResponse {
  data: {
    fileUploadRequest: {
      id: string;
      uploadUrl: string;
    };
  };
};

export interface File {
  name: string;
  size: number;
  type: string;
}

export interface UploadedFile {
  name: string;
  id: string;
}

export interface UploadState {
  uploadedFiles: UploadedFile[];
  addFile: (file: UploadedFile) => void;
}
