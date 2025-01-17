import Video from "@/components/ui/video";
import { TabPanel } from "@mui/joy";

export default function VideoChatUI() {
    return (
        <TabPanel value={0} sx={{ p: 1.25, overflowY: "auto", display: "flex", flexDirection: "column", gap: 1.25 }}>
            <Video />
            <Video />
            <Video />
        </TabPanel>
    );
}
