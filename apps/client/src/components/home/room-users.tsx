import { useUserStore } from "@/stores/room/useUserStore";
import { Avatar, AvatarGroup, Dropdown, ListDivider, Menu, MenuButton } from "@mui/joy";
import { ArrowDownIcon } from "../icons";

export default function RoomUsers() {
    const { currUser, roomUser } = useUserStore();

    if (currUser) {
        const users = Array.from(roomUser.values());

        return (
            <Dropdown>
                <MenuButton sx={{ p: 0, border: "none" }}>
                    <AvatarGroup>
                        <Avatar alt={currUser.name} />
                        {users?.length ? <Avatar>+{`${users.length}`.padStart(2, "0")}</Avatar> : null}
                        <div style={{ marginLeft: 4 }}>
                            <ArrowDownIcon />
                        </div>
                    </AvatarGroup>
                </MenuButton>
                <Menu placement="bottom-end" sx={{ width: 256 }}>
                    <div
                        style={{
                            paddingBlock: 4,
                            paddingInline: 8,
                            display: "flex",
                            alignItems: "center",
                            gap: 8,
                        }}
                    >
                        <Avatar alt={currUser.name} />
                        <div>{currUser.name}</div>
                    </div>
                    {users?.length ? (
                        <>
                            <ListDivider />
                            {users.map((user) => (
                                <div
                                    key={user.id}
                                    style={{
                                        paddingBlock: 4,
                                        paddingInline: 8,
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 8,
                                    }}
                                >
                                    <Avatar alt={user.name} />
                                    <div>{user.name}</div>
                                </div>
                            ))}
                        </>
                    ) : null}
                </Menu>
            </Dropdown>
        );
    }
}
