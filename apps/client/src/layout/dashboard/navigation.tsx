import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { RiFolder5Fill, RiDeleteBin5Fill, RiSettings3Fill, RiArtboardFill } from "react-icons/ri";
import { List, ListSubheader, ListItem, ListItemButton, ListItemDecorator, ListItemContent } from "@mui/joy";

const navItems = [
    {
        type: "Browse",
        children: [
            {
                href: "/rooms",
                label: "My files",
                icon: <RiFolder5Fill size={20} />,
            },
            {
                href: "/trash",
                label: "Trash",
                icon: <RiDeleteBin5Fill size={20} />,
            },
        ],
    },
    {
        type: "Navigation",
        children: [
            {
                href: "/setting",
                label: "Setting",
                icon: <RiSettings3Fill size={20} />,
            },
            {
                href: "/",
                label: "Back To Canvas",
                icon: <RiArtboardFill size={20} />,
            },
        ],
    },
];

export default function Navigation() {
    const navigate = useNavigate();
    const { pathname } = useLocation();

    return (
        <List sx={{ "--ListItem-radius": "8px", "--List-gap": "4px" }}>
            <ListItem nested>
                {navItems.map(({ type, children }, idx) => (
                    <React.Fragment key={idx}>
                        <ListSubheader sx={{ mt: idx !== 0 ? 2.5 : 0, letterSpacing: "2px", fontWeight: "800" }}>{type}</ListSubheader>
                        <List sx={{ "& .JoyListItemButton-root": { p: "8px" } }}>
                            {children.map(({ href, icon, label }, idx) => (
                                <ListItem key={idx}>
                                    <ListItemButton onClick={() => navigate(href)} selected={href === pathname}>
                                        <ListItemDecorator>{icon}</ListItemDecorator>
                                        <ListItemContent>{label}</ListItemContent>
                                    </ListItemButton>
                                </ListItem>
                            ))}
                        </List>
                    </React.Fragment>
                ))}
            </ListItem>
        </List>
    );
}
