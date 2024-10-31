import { useState } from 'react';
import { useUploadStore } from '../stores/trackUploadStore';
import { useLibraryStore } from '../stores/libraryStore';
import { requestUploadUrl, uploadTrackToUrl, createLibraryTrack } from '../services/trackUploadService';
import type { File, UploadedFile, UploadState } from '../types/trackUploadTypes';
import { Container, Button, Form } from 'react-bootstrap';

const TrackUpload: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const addFile = useUploadStore((state: UploadState) => state.addFile);
  const refetchLibraryTracks = useLibraryStore((state) => state.refetchLibraryTracks);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    if (event.target.files && event.target.files.length > 0) {
      setFile(event.target.files[0] ?? null);
    }
  };

  const handleUpload = async (): Promise<void> => {
    if (file) {
      if (file.type !== 'audio/mpeg') {
        alert('Only MP3 files are allowed');
        return;
      }

      const maxDurationMinutes = 15;
      const audio = new Audio(URL.createObjectURL(file as unknown as Blob));
      audio.onloadedmetadata = async () => {
        if (audio.duration > maxDurationMinutes * 60) {
          alert(`File duration exceeds the limit of ${maxDurationMinutes} minutes`);
          return;
        }

        try {
          const response = await requestUploadUrl();
          const { uploadUrl, id } = response.data.fileUploadRequest;

          await uploadTrackToUrl(uploadUrl, file);
          const libraryTrackId = await createLibraryTrack(id, file.name);

          addFile({ name: file.name, id: libraryTrackId} as UploadedFile);
          setFile(null);

          // Set a 4 second timeout to allow the file to be processed before refetching the library tracks
          // setTimeout(() => {
          //   refetchLibraryTracks();
          // }, 4000);

          refetchLibraryTracks();

        } catch (error) {
          console.error('Error during file upload process:', error);
        }
      };
    }
  };

  return (
    <Container>
      <Form>
        <Form.Group controlId="formFile" className="mb-3">
          <Form.Label>Upload Track</Form.Label>
          <Form.Control type="file" onChange={handleFileChange} />
        </Form.Group>
        <Button variant="primary" onClick={handleUpload} disabled={!file}>
          Upload File
        </Button>
      </Form>
    </Container>
  );
};

export default TrackUpload;

// import { useState } from 'react';
// import { useUploadStore } from '../store/uploadStore';
// import type { File, UploadedFile, UploadState, FileUploadResponse } from '../../types/fileUploadTypes';


// const FileUpload: React.FC = () => {
//   const [file, setFile] = useState<File | null>(null);
//   const addFile = useUploadStore((state: UploadState) => state.addFile);

//   const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
//     console.log('File selected:', event.target.files?.[0]);
//     if (event.target.files && event.target.files.length > 0) {
//       setFile(event.target.files[0] ?? null);
//     }
//   };

//   const requestUploadUrl = async (): Promise<FileUploadResponse> => {
//     console.log('Requesting file upload URL...');

//     const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/upload/request-upload`, {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//     });

//     if (!response.ok) {
//       throw new Error(`Failed to request upload URL: ${response.statusText}`);
//     }

//     return response.json() as Promise<FileUploadResponse>;
//   };

//   const uploadFileToUrl = async (uploadUrl: string, file: File) => {
//     console.log('Uploading file to signed URL...', uploadUrl);

//     const response = await fetch(uploadUrl, {
//       method: 'PUT',
//       body: file as unknown as Blob,
//       headers: {
//         'Content-Type': 'audio/mpeg',
//         'Content-Length': file.size.toString(),
//       },
//     });

//     if (!response.ok) {
//       throw new Error(`Failed to upload file: ${response.statusText}`);
//     }

//     console.log('File uploaded successfully');
//   };

//   const createLibraryTrack = async (fileId: string, fileName: string) => {
//     console.log('Requesting library track creation with:', { id: fileId, name: fileName });

//     const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/upload/library-track-create`, {
//       method: 'POST',
//       body: JSON.stringify({ id: fileId, name: fileName }),
//       headers: {
//         'Content-Type': 'application/json',
//       },
//     });

//     if (!response.ok) {
//       throw new Error(`Failed to create library track: ${response.statusText}`);
//     }

//     console.log('Library track created successfully');
//   };

//   const handleUpload = async (): Promise<void> => {
//     if (file) {

//       try {
//         const fileUploadResponse = await requestUploadUrl();
//         const { uploadUrl, id } = fileUploadResponse.data.fileUploadRequest;

//         await uploadFileToUrl(uploadUrl, file);
//         await createLibraryTrack(id, file.name);

//         addFile({ name: file.name, id: id } as UploadedFile);
//         setFile(null);

//       } catch (error) {
//         console.error('Error during file upload process:', error);
//       }
//     }
//   };

//   return (
//     <div className="file-upload-container">
//       <input type="file" onChange={handleFileChange} />
//       <button onClick={handleUpload} className="btn btn-primary" disabled={!file}>
//         Upload File
//       </button>
//     </div>
//   );
// };

// export default FileUpload;

// import { create } from 'zustand';
// import type { UploadState } from '~/types/fileUploadTypes';


// export const useUploadStore = create<UploadState>((set) => ({
//   uploadedFiles: [],
//   addFile: (file) => set((state) => ({ uploadedFiles: [...state.uploadedFiles, file] })),
// }));

// import { Router } from 'express';
// import { requestFileUpload, libraryTrackCreate } from '../services/fileUploadService.js';

// const router = Router();

// router.post('/request-upload', async (req, res) => {
//   try {
//     console.log('Received request to /request-upload');
//     const uploadInfo = await requestFileUpload();
//     console.log('Sending upload info response to client...');
//     res.json(uploadInfo);
//   } catch (error) {
//     console.error('Error during file upload request:', error);
//     res.status(500).json({ message: 'File upload request failed', error });
//   }
// });

// router.post('/library-track-create', async (req, res) => {
//   try {
//     console.log('Received request to /library-track-create');
//     const { id, name } = req.body;
//     const result = await libraryTrackCreate(id, name);
//     console.log('Library track created successfully');
//     res.json(result);
//   } catch (error) {
//     console.error('Error during library track creation:', error);
//     res.status(500).json({ message: 'Library track creation failed', error });
//   }
// });

// export default router;

// import fetch from 'node-fetch';
// import { cleanEnv, str } from 'envalid';

// const { ACCESS_TOKEN, API_URL } = cleanEnv(process.env, {
//   ACCESS_TOKEN: str(),
//   API_URL: str(),
// });

// export const requestFileUpload = async () => {
//   const mutationDocument = /* GraphQL */ `
//     mutation fileUploadRequest {
//       fileUploadRequest {
//         id
//         uploadUrl
//       }
//     }
//   `;

//   console.log('Requesting file upload URL...');
//   const response = await fetch(API_URL, {
//     method: 'POST',
//     body: JSON.stringify({ query: mutationDocument }),
//     headers: {
//       Authorization: `Bearer ${ACCESS_TOKEN}`,
//       'Content-Type': 'application/json',
//     },
//   });

//   const result = await response.json();
//   return result;
// };

// export const libraryTrackCreate = async (fileUploadRequestId: string, fileName: string) => {
//   const libraryTrackCreateMutation = /* GraphQL */ `
//     mutation LibraryTrackCreate($input: LibraryTrackCreateInput!) {
//       libraryTrackCreate(input: $input) {
//         ... on LibraryTrackCreateError {
//           message
//         }
//         ... on LibraryTrackCreateSuccess {
//           createdLibraryTrack {
//             __typename
//             id
//           }
//         }
//       }
//     }
//   `;

//   console.log('Requesting library track creation...');
//   const result = await fetch(API_URL, {
//     method: "POST",
//     body: JSON.stringify({
//       query: libraryTrackCreateMutation,
//       variables: {
//         input: {
//           title: fileName,
//           uploadId: fileUploadRequestId
//         }
//       }
//     }),
//     headers: {
//       Authorization: "Bearer " + ACCESS_TOKEN,
//       "Content-Type": "application/json"
//     }
//   }).then(res => res.json());

//   console.log("[info] libraryTrackCreate response: ");
//   console.log(JSON.stringify(result, undefined, 2));

//   type LibraryTrackCreateResponse = {
//     data: {
//       libraryTrackCreate: any;
//     };
//   };

//   return (result as LibraryTrackCreateResponse).data.libraryTrackCreate;
// };
