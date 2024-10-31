import { useEffect, useState } from 'react';
import { useLibraryStore } from '../stores/libraryStore';
import { Table, Container, Button } from 'react-bootstrap';
import { fetchLibraryTracks } from '../services/libraryTableService';
import type { LibraryTrack } from '../types/libraryTableTypes';

const LibraryTable: React.FC = () => {
  const [tracks, setTracks] = useState<LibraryTrack[]>([]);
  const [hasNextPage, setHasNextPage] = useState<boolean>(true);
  const [afterCursor, setAfterCursor] = useState<string | null>(null);

  const loadTracks = async () => {
    try {
      const response = await fetchLibraryTracks(10, afterCursor);
      const { edges, pageInfo } = response.data.libraryTracks;
      console.log('edges:', edges);
      console.log('pageInfo:', pageInfo);

      setTracks((prevTracks) => [...prevTracks, ...edges.map((edge) => edge.node)]);
      setHasNextPage(pageInfo.hasNextPage);
      setAfterCursor(edges.length > 0 ? edges[edges.length - 1].cursor : null);
    } catch (error) {
      console.error('Error fetching library tracks:', error);
    }
  };

  const refetchTracks = async () => {
    setTracks([]);
    setAfterCursor(null);
    setHasNextPage(true);
    await loadTracks();
  };

  useEffect(() => {
    loadTracks();
  }, []);

  useLibraryStore.setState({ refetchLibraryTracks: refetchTracks });

  return (
    <Container>
      <h1>Library Tracks</h1>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Title</th>
            <th>BPM</th>
            <th>Key Value</th>
            <th>Predominant Voice Gender</th>
            <th>Musical Era Tag</th>
            <th>Genre Tags</th>
            <th>Mood Tags</th>
            <th>Instrument Tags</th>
            <th>Time Signature</th>
            <th>Energy Level</th>
            <th>Energy Dynamics</th>
            <th>ID</th>
          </tr>
        </thead>
        <tbody>
          {tracks.map((track) => (
            <tr key={track.id}>
              <td>{track.title || 'None'}</td>
              <td>{track.audioAnalysisV6?.result?.bpm || 'None'}</td>
              <td>{track.audioAnalysisV6?.result?.keyPrediction?.value || 'None'}</td>
              <td>{track.audioAnalysisV6?.result?.predominantVoiceGender || 'None'}</td>
              <td>{track.audioAnalysisV6?.result?.musicalEraTag || 'None'}</td>
              <td>{track.audioAnalysisV6?.result?.genreTags?.join(', ') || 'None'}</td>
              <td>{track.audioAnalysisV6?.result?.moodTags?.join(', ') || 'None'}</td>
              <td>{track.audioAnalysisV6?.result?.instrumentTags?.join(', ') || 'None'}</td>
              <td>{track.audioAnalysisV6?.result?.timeSignature || 'None'}</td>
              <td>{track.audioAnalysisV6?.result?.energyLevel || 'None'}</td>
              <td>{track.audioAnalysisV6?.result?.energyDynamics || 'None'}</td>
              <td>{track.id}</td>
            </tr>
          ))}
        </tbody>
      </Table>
      {hasNextPage && (
        <Button variant="primary" onClick={loadTracks} className="mt-3">
          Load More
        </Button>
      )}
    </Container>
  );
};

export default LibraryTable;





// import { useUploadStore } from '../stores/trackUploadStore';

// const LibraryTable: React.FC = () => {
//   const uploadedFiles = useUploadStore((state) => state.uploadedFiles);

//   return (
//     <div className="analysis-table-container">
//       <h3>Uploaded Files</h3>
//       <table className="table">
//         <thead>
//           <tr>
//             <th>Track Name</th>
//             <th>ID</th>
//           </tr>
//         </thead>
//         <tbody>
//           {uploadedFiles.map((file, index) => (
//             <tr key={index}>
//               <td>{file.name}</td>
//               <td>{file.id}</td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export default LibraryTable;
