'use client';

import { useEffect, useState } from 'react';

interface GooglePDFViewerProps {
  fileUrl: string;
}

function GooglePDFViewer({ fileUrl }: GooglePDFViewerProps) {
  const viewerUrl = `https://docs.google.com/gview?embedded=true&url=${encodeURIComponent(fileUrl)}`;

  return (
    <iframe
      src={viewerUrl}
      className="w-full h-screen border-0"
      title="PDF Viewer"
    />
  );
}

export default function ResumePage() {
  const [fileUrl, setFileUrl] = useState('');

  useEffect(() => {
    setFileUrl(`${window.location.origin}/resume.pdf`);
  }, []);

  if (!fileUrl) {
    return null; // or a loading spinner
  }

  return <GooglePDFViewer fileUrl={fileUrl} />;
}
