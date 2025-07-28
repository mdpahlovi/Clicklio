export const downloadMedia = async (mediaBlobUrl: string) => {
    try {
        const response = await fetch(mediaBlobUrl);
        const blob = await response.blob();

        const downloadUrl = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = downloadUrl;

        link.download = `canvas-record.webm`;

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        URL.revokeObjectURL(downloadUrl);
    } catch (error) {
        console.error("Error downloading media:", error);
    }
};
