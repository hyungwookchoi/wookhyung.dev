'use client';

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
  const fileUrl = `${window.location.origin}/resume.pdf`;

  return <GooglePDFViewer fileUrl={fileUrl} />;
}
