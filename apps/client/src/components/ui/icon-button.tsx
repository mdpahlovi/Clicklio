import { cn } from "@/utils/cn";

export default function IconButton({ active, className, ...props }: { active?: boolean } & React.ButtonHTMLAttributes<HTMLButtonElement>) {
    return (
        <button
            className={cn(
                "inline-flex size-10 items-center justify-center rounded bg-foreground transition-colors hover:bg-primary/5 active:border active:border-primary disabled:pointer-events-none disabled:opacity-50 data-[active=true]:bg-primary/20",
                className,
            )}
            {...props}
            data-active={active}
        />
    );
}
