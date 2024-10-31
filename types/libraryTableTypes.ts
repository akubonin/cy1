export interface LibraryTrack {
  id: string;
  title: string;
  audioAnalysisV6?: {
    __typename: string;
    result?: {
      bpm: number;
      keyPrediction: {
        value: string;
        confidence: number;
      };
      predominantVoiceGender: string;
      musicalEraTag: string;
      genreTags: string[];
      moodTags: string[];
      instrumentTags: string[];
      timeSignature: string;
      energyLevel: string;
      energyDynamics: string;
    };
  };
}
