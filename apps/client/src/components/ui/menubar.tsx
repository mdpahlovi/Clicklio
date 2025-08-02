import { DeleteIcon, DownloadIcon, HelpIcon, ImageDownloadIcon, MenuIcon, UploadIcon } from "@/components/icons";
import { useCanvasState } from "@/stores/canvas/useCanvasState";
import { useEventStore } from "@/stores/canvas/useEventStore";
import { Dropdown, IconButton, Menu, MenuButton, MenuItem } from "@mui/joy";
import React from "react";

type ManubarProps = {
    setIsGuideModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
};
type MenuItemProps = {
    label: string;
    icon: React.ReactNode;
    color?: "danger";
    onClick?: () => void;
    disabled?: boolean;
};

export default function Menubar({ setIsGuideModalOpen }: ManubarProps) {
    const { resetEvent } = useEventStore();
    const { setRefresh } = useCanvasState();

    const menuItems: MenuItemProps[] = [
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
                // Implement export image logic for Konva
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
                {menuItems.map((item, idx) => (
                    <MenuItem key={idx} color={item.color} onClick={item.onClick} disabled={item.disabled}>
                        {item.icon}
                        {item.label}
                    </MenuItem>
                ))}
            </Menu>
        </Dropdown>
    );
}
