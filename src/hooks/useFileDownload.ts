import { useCallback, useState } from 'react';

export function useFileDownload() {
  const [isDownloading, setIsDownloading] = useState(false);

  const downloadFile = useCallback(async (url: string) => {
    setIsDownloading(true);
    try {
      const filenameMatch = url.match(/\/([^/?]+)\?/);
      const filename = filenameMatch ? filenameMatch[1] : 'download';

      const response = await fetch(url);
      const blob = await response.blob();
      const objectUrl = URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = objectUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(objectUrl);
    } catch (error) {
      console.error('Download failed:', error);
    } finally {
      setIsDownloading(false);
    }
  }, []);

  return { downloadFile, isDownloading };
}
