import { DeleteIcon, DownloadIcon, HelpIcon, ImageDownloadIcon, MenuIcon, UploadIcon } from "@/components/icons";
import { useCanvasState } from "@/stores/canvas/useCanvasState";
import { useEventStore } from "@/stores/canvas/useEventStore";
import { Dropdown, IconButton, Menu, MenuButton, MenuItem } from "@mui/joy";

type ManubarProps = {
    canvasRef: React.RefObject<HTMLCanvasElement | null>;
    setIsGuideModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
};
type MenuItemProps = {
    label: string;
    icon: React.ReactNode;
    color?: "danger";
    onClick?: () => void;
    disabled?: boolean;
};

export default function Menubar({ canvasRef, setIsGuideModalOpen }: ManubarProps) {
    const { resetEvent } = useEventStore();
    const { setRefresh } = useCanvasState();

    const manuItems: MenuItemProps[] = [
        {
            label: "Open",
            icon: <UploadIcon />,
            disabled: true,
        },
        {
            label: "Save as",
            icon: <DownloadIcon />,
            disabled: true,
        },
        {
            label: "Export image",
            icon: <ImageDownloadIcon />,
            onClick: () => {
                if (canvasRef.current) {
                    const dataUrl = canvasRef.current.toDataURL("image/png");
                    const link = document.createElement("a");
                    link.download = "canvas-image.png";
                    link.href = dataUrl;
                    link.click();
                }
            },
        },
        {
            label: "Shortcuts",
            icon: <HelpIcon />,
            onClick: () => setIsGuideModalOpen(true),
        },
        {
            label: "Reset canvas",
            icon: <DeleteIcon />,
            color: "danger",
            onClick: () => {
                resetEvent();
                setRefresh();
            },
        },
    ];

    return (
        <Dropdown>
            <MenuButton component={IconButton} sx={{ p: 0, border: "none" }}>
                <MenuIcon />
            </MenuButton>
            <Menu placement="bottom-start" sx={{ zIndex: 99 }}>
                {manuItems.map((item, idx) => (
                    <MenuItem key={idx} color={item.color} onClick={item.onClick} disabled={item.disabled}>
                        {item.icon}
                        {item.label}
                    </MenuItem>
                ))}
            </Menu>
        </Dropdown>
    );
}
