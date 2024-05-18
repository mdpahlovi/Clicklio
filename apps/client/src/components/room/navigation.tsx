import { RiFolder5Fill, RiDeleteBin5Fill } from "react-icons/ri";
import { List, ListSubheader, ListItem, ListItemButton, ListItemDecorator, ListItemContent } from "@mui/joy";

export default function Navigation() {
    return (
        <List sx={{ "--ListItem-radius": "8px", "--List-gap": "4px" }}>
            <ListItem nested>
                <ListSubheader sx={{ letterSpacing: "2px", fontWeight: "800" }}>Browse</ListSubheader>
                <List aria-labelledby="nav-list-browse" sx={{ "& .JoyListItemButton-root": { p: "8px" } }}>
                    <ListItem>
                        <ListItemButton selected>
                            <ListItemDecorator>
                                <RiFolder5Fill size={20} />
                            </ListItemDecorator>
                            <ListItemContent>My files</ListItemContent>
                        </ListItemButton>
                    </ListItem>
                    <ListItem>
                        <ListItemButton>
                            <ListItemDecorator>
                                <RiDeleteBin5Fill size={20} />
                            </ListItemDecorator>
                            <ListItemContent>Trash</ListItemContent>
                        </ListItemButton>
                    </ListItem>
                </List>
            </ListItem>
        </List>
    );
}
