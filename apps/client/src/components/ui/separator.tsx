import { cn } from "@/utils/cn";

export default function Separator({ vertical, className, ...props }: { vertical?: boolean } & React.HTMLAttributes<HTMLDivElement>) {
    return <div style={!vertical ? { height: "1px" } : { width: "1px" }} className={cn("my-auto bg-border", className)} {...props} />;
}
