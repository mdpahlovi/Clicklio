export const downloadMedia = async (mediaBlobUrl: string) => {
    try {
        const response = await fetch(mediaBlobUrl);
        const blob = await response.blob();

        const downloadUrl = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = downloadUrl;

        const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
        link.download = `screen-recording-${timestamp}.webm`;

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        URL.revokeObjectURL(downloadUrl);
    } catch (error) {
        console.error("Error downloading media:", error);
    }
};
