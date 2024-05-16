import { Input } from "@mui/joy";
import { useEffect, useId, useRef, useState } from "react";

export default function Test() {
    const id = useId();
    const [value, setValue] = useState("");
    const isEditing = useRef<boolean>(false);

    useEffect(() => {
        const input = document.getElementById(id);

        window.addEventListener("mousedown", () => {
            if (isEditing.current) {
                document.body.style.cursor = "w-resize";
                if (input) input.style.cursor = "w-resize";
            }
        });

        window.addEventListener("mousemove", () => {
            if (isEditing.current) {
                document.body.style.cursor = "w-resize";
                if (input) input.style.cursor = "w-resize";

                setValue((value) => (Number(value) + 1).toString());
            }
        });

        window.addEventListener("mouseup", () => {
            if (isEditing.current) {
                isEditing.current = false;
                document.body.style.cursor = "default";
                if (input) input.style.cursor = "default";
            }
        });

        return () => {
            window.removeEventListener("mousedown", () => {
                if (isEditing.current) {
                    document.body.style.cursor = "w-resize";
                    if (input) input.style.cursor = "w-resize";
                }
            });

            window.removeEventListener("mousemove", () => {
                if (isEditing.current) {
                    document.body.style.cursor = "w-resize";
                    if (input) input.style.cursor = "w-resize";

                    setValue((value) => (Number(value) + 1).toString());
                }
            });

            window.removeEventListener("mouseup", () => {
                if (isEditing.current) {
                    isEditing.current = false;
                    document.body.style.cursor = "default";
                    if (input) input.style.cursor = "default";
                }
            });
        };
    }, []);

    return (
        <div style={{ width: "100%", height: "100vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
            <Input
                id={id}
                startDecorator={
                    <div style={{ cursor: "w-resize", userSelect: "none" }} onMouseDown={() => (isEditing.current = true)}>
                        P
                    </div>
                }
                placeholder="Width"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                slotProps={{ input: { id } }}
            />
        </div>
    );
}
