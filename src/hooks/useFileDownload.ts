import { useCallback, useState } from 'react';

export function useFileDownload() {
  const [isDownloading, setIsDownloading] = useState(false);

  const downloadFile = useCallback(
    async (buffer: Uint8Array, fileName: string) => {
      setIsDownloading(true);

      try {
        const blob = new Blob([buffer], { type: 'application/pdf' });
        const objectUrl = URL.createObjectURL(blob);

        const link = document.createElement('a');

        link.href = objectUrl;
        link.download = fileName;

        document.body.appendChild(link);

        link.click();

        document.body.removeChild(link);
        URL.revokeObjectURL(objectUrl);
      } catch (error) {
        console.error('Download failed:', error);
      } finally {
        setIsDownloading(false);
      }
    },
    []
  );

  return { downloadFile, isDownloading };
}
