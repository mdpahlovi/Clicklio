import { Button } from "@/components/ui/button";
// import { exportToPdf } from "@/lib/utils";

const Export = () => (
    <div className="flex flex-col gap-3 px-5 py-3">
        <h3 className="text-[10px] uppercase">Export</h3>
        <Button variant="outline" className="border-primary-grey-100 hover:bg-primary-green hover:text-primary-black w-full border">
            Export to PDF
        </Button>
    </div>
);

export default Export;
