import type { File } from "../types/trackUploadTypes";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;
const accessToken = process.env.NEXT_PUBLIC_ACCESS_TOKEN;

export const requestUploadUrl = async () => {
  const fileUploadRequestMutation = `
    mutation fileUploadRequest {
      fileUploadRequest {
        id
        uploadUrl
      }
    }
  `;

  if (!apiUrl) {
    throw new Error('API URL is not defined');
  }

  const response = await fetch(apiUrl, {
    method: 'POST',
    body: JSON.stringify({ query: fileUploadRequestMutation }),
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
  });

  const result = await response.json();
  console.log('File upload URL requested successfully');
  return result;
};

export const uploadTrackToUrl = async (uploadUrl: string, file: File) => {
  const response = await fetch(uploadUrl, {
    method: 'PUT',
    body: file as unknown as Blob,
    headers: {
      'Content-Type': 'audio/mpeg',
      'Content-Length': file.size.toString(),
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to upload file: ${response.statusText}`);
  }
  console.log('File uploaded successfully');
};

export const createLibraryTrack = async (fileUploadRequestId: string, fileName: string) => {
  const libraryTrackCreateMutation = /* GraphQL */ `
    mutation LibraryTrackCreate($input: LibraryTrackCreateInput!) {
      libraryTrackCreate(input: $input) {
        ... on LibraryTrackCreateError {
          message
        }
        ... on LibraryTrackCreateSuccess {
          createdLibraryTrack {
            __typename
            id
          }
        }
      }
    }
  `;

  if (!apiUrl) {
    throw new Error('API URL is not defined');
  }

  const response = await fetch(apiUrl, {
    method: "POST",
    body: JSON.stringify({
      query: libraryTrackCreateMutation,
      variables: {
        input: {
          title: fileName,
          uploadId: fileUploadRequestId
        }
      }
    }),
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json"
    }
  });

  if (!response.ok) {
    throw new Error(`Failed to create library track: ${response.statusText}`);
  }

  const data = await response.json();
  const libraryTrackId = data.data.libraryTrackCreate.createdLibraryTrack.id;

  console.log('Library track created successfully. Track ID:', libraryTrackId);
  return libraryTrackId;
};
