const apiUrl = process.env.NEXT_PUBLIC_API_URL;
const accessToken = process.env.NEXT_PUBLIC_ACCESS_TOKEN;

export const fetchLibraryTracks = async (first: number, after: string | null) => {
  const fetchLibraryTracksQuery = `
    query PaginatedLibraryTracksQuery($first: Int!, $after: String) {
      libraryTracks(first: $first, after: $after) {
        pageInfo {
          hasNextPage
        }
        edges {
          cursor
          node {
            id
            title
            audioAnalysisV6 {
              __typename
              ... on AudioAnalysisV6Finished {
                result {
                  bpm
                  keyPrediction {
                    value
                    confidence
                  }
                  predominantVoiceGender
                  musicalEraTag
                  genreTags
                  moodTags
                  instrumentTags
                  timeSignature
                  energyLevel
                  energyDynamics
                }
              }
            }
          }
        }
      }
    }
  `;

  const variables = { first, after };

  if (!apiUrl) {
    throw new Error('API URL is not defined');
  }

  const response = await fetch(apiUrl, {
    method: 'POST',
    body: JSON.stringify({ query: fetchLibraryTracksQuery, variables }),
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch library tracks: ${response.statusText}`);
  }

  const result = await response.json();
  return result;
};