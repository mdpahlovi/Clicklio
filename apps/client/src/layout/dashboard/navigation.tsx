import { List, ListItem, ListItemButton, ListItemContent, ListItemDecorator, ListSubheader } from "@mui/joy";
import { useLocation, useNavigate } from "react-router-dom";
import { CanvasFillIcon, FolderFillIcon, SettingFillIcon } from "../../components/icons";

const navItems = [
    {
        type: "Browse",
        children: [{ href: "/rooms", label: "Rooms", icon: <FolderFillIcon /> }],
    },
    {
        type: "Navigation",
        children: [
            { href: "/setting", label: "Setting", icon: <SettingFillIcon /> },
            { href: "/", label: "Back To Canvas", icon: <CanvasFillIcon /> },
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
                    <div key={idx}>
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
                    </div>
                ))}
            </ListItem>
        </List>
    );
}
