import { DeleteIcon, DownloadIcon, HelpIcon, ImageDownloadIcon, MenuIcon, UploadIcon } from "@/components/icons";
import { Dropdown, IconButton, ListDivider, Menu, MenuButton, MenuItem } from "@mui/joy";
import { Fragment } from "react";
import { useCanvasState } from "../../hooks/zustand/useCanvasState";
import { useEventStore } from "../../stores/canvas/useEventStore";

type ManubarProps = {
    canvasRef: React.RefObject<HTMLCanvasElement | null>;
    setIsGuideModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function Menubar({ canvasRef, setIsGuideModalOpen }: ManubarProps) {
    const { resetEvent } = useEventStore();
    const { setRefresh } = useCanvasState();

    const manuItems = [
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
            <MenuButton sx={{ p: 0, border: "none" }}>
                <IconButton>
                    <MenuIcon />
                </IconButton>
            </MenuButton>
            <Menu placement="bottom-start" sx={{ zIndex: 99 }}>
                {manuItems.map((item, idx) => (
                    <Fragment key={idx}>
                        {idx !== 0 ? <ListDivider /> : null}
                        {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
                        {/* @ts-ignore */}
                        <MenuItem color={item.color} onClick={item.onClick} disabled={item.disabled}>
                            {item.icon}
                            {item.label}
                        </MenuItem>
                    </Fragment>
                ))}
            </Menu>
        </Dropdown>
    );
}
