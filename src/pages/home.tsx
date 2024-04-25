import { Button } from "@/components/ui/button";

export default function HomePage() {
    return (
        <>
            <div className="flex h-screen flex-col gap-6 p-6">
                <div className="bg-red-500">
                    <Button>Pahlovi</Button>
                </div>
                <div className="bg-red-500">Middle</div>
                <div className="mt-auto bg-red-500">Bottom</div>
            </div>
        </>
    );
}
