import type { Room } from "@/types/room";
import { Avatar, AvatarGroup, Box, Card, CardContent, Stack, Typography, useTheme } from "@mui/joy";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function RoomCard({ room }: { room: Room }) {
    const navigate = useNavigate();
    const { palette } = useTheme();
    const [isHovered, setIsHovered] = useState(false);

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
        });
    };

    return (
        <Card
            variant="outlined"
            onClick={() => navigate(`/room/${room.id}`)}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            sx={{
                position: "relative",
                overflow: "hidden",
                cursor: "pointer",
                transition: "all 0.3s ease-in-out",
                transform: isHovered ? "translateY(-4px)" : "translateY(0)",
                boxShadow: isHovered ? "0 10px 25px rgba(0, 0, 0, 0.15)" : "0 2px 8px rgba(0, 0, 0, 0.1)",
                "&:hover": { borderColor: "primary.500" },
            }}
        >
            {/* Room Image/Thumbnail */}
            <Box
                sx={{
                    aspectRatio: "16/9",
                    background: room.photo ? `url(${room.photo})` : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    position: "relative",
                    "&::before": {
                        content: '""',
                        position: "absolute",
                        inset: 0,
                        background: "linear-gradient(45deg, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.05) 100%)",
                    },
                }}
            >
                {!room.photo && (
                    <Typography
                        level="h2"
                        sx={{
                            color: "white",
                            fontWeight: "bold",
                            textShadow: "0 2px 4px rgba(0,0,0,0.3)",
                            zIndex: 1,
                        }}
                    >
                        {room.name.charAt(0).toUpperCase()}
                    </Typography>
                )}
            </Box>
            <CardContent sx={{ px: 2, py: 1.25 }}>
                <Stack spacing={0.75}>
                    <Typography
                        level="title-md"
                        fontWeight="bold"
                        sx={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}
                    >
                        {room.name}
                    </Typography>
                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                        <Stack direction="row" alignItems="center" spacing={1}>
                            <AvatarGroup size="sm" sx={{ "--Avatar-size": "24px" }}>
                                {room.roomUsers.map(({ userInfo: user }) => (
                                    <Avatar key={user.id} src={user.photo || undefined} alt={user.name}>
                                        {user.name.charAt(0).toUpperCase()}
                                    </Avatar>
                                ))}
                                {room.roomUsers.length > 3 && (
                                    <Avatar size="sm" sx={{ "--Avatar-size": "24px" }}>
                                        +{room.roomUsers.length - 3}
                                    </Avatar>
                                )}
                            </AvatarGroup>
                            <Typography level="body-xs" sx={{ color: "text.secondary" }}>
                                {room.roomUsers.length} member{room.roomUsers.length !== 1 ? "s" : ""}
                            </Typography>
                        </Stack>

                        <Typography level="body-xs" sx={{ color: "text.secondary" }}>
                            {formatDate(room.createdAt)}
                        </Typography>
                    </Stack>
                </Stack>
            </CardContent>

            {/* Hover Overlay */}
            <Box
                sx={{
                    position: "absolute",
                    inset: 0,
                    background: palette.mode === "light" ? "rgba(0, 0, 0, 0.05)" : "rgba(255, 255, 255, 0.05)",
                    opacity: isHovered ? 1 : 0,
                    transition: "opacity 0.3s ease-in-out",
                }}
            />

            {/* Slide-in Action Button */}
            <Box
                sx={{
                    position: "absolute",
                    top: 16,
                    right: 16,
                    opacity: isHovered ? 1 : 0,
                    transition: "opacity 0.3s ease-in-out",
                }}
            >
                <Box
                    sx={{
                        width: 32,
                        height: 32,
                        border: "1px solid",
                        borderColor: "background.body",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        borderRadius: 16,
                    }}
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        width="24"
                        height="24"
                        color={palette.background.body}
                        fill="none"
                    >
                        <path
                            d="M9.00005 6C9.00005 6 15 10.4189 15 12C15 13.5812 9 18 9 18"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        ></path>
                    </svg>
                </Box>
            </Box>
        </Card>
    );
}
