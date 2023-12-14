import { Tool } from "@/types";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import useCanvasStore from "@/hooks/useCanvasStore";
import { capitalizeFirstWord } from "@/lib/capitalizeFirstWord";
import { Delete } from "lucide-react";
import { gql, useMutation } from "@apollo/client";
import { GET_CANVASES } from "@/pages/main/home";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

const DELETE_CANVAS = gql`
    mutation Delete_Canvas($code: String!) {
        deleteCanvas(code: $code) {
            code
        }
    }
`;

const stokeTypes = ["pencil", "line", "rectangle", "ellipse"];

export default function TopBar({ clearCanvas }: { clearCanvas: () => void }) {
    const params = useParams();
    const navigate = useNavigate();
    const { stroke, tool, setStroke, setTool } = useCanvasStore();
    const [deleteCanvas] = useMutation(DELETE_CANVAS, { refetchQueries: [GET_CANVASES, "GetCanvases"] });

    const handleDelete = () => {
        deleteCanvas({ variables: { code: params?.id } });
        toast.success("Canvas Deleted Successfully");
        navigate("/");
    };

    return (
        <div className="border rounded-lg p-6 flex justify-between items-center gap-4">
            <input
                type="color"
                defaultValue={stroke}
                onChange={(e) => setStroke(e.target.value)}
                className="border rounded-lg p-0.5 py-[1px]"
            />
            <RadioGroup defaultValue={tool} onValueChange={(value: Tool) => setTool(value)} className="flex">
                {stokeTypes.map((type, idx) => (
                    <div key={idx} className="flex items-center space-x-2">
                        <RadioGroupItem value={type} id={idx.toString()} />
                        <Label htmlFor={idx.toString()}>{capitalizeFirstWord(type)}</Label>
                    </div>
                ))}
            </RadioGroup>
            <div className="flex gap-4">
                <Button variant="destructive" size="sm" onClick={clearCanvas}>
                    Clear Canvas
                </Button>
                <Button variant="destructive" size="icon" className="w-9 h-9" onClick={handleDelete}>
                    <Delete size={20} />
                </Button>
            </div>
        </div>
    );
}
