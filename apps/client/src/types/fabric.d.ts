import { FabricObject } from "fabric";

declare module "fabric" {
    // to have the properties recognized on the instance and in the constructor
    interface FabricObject {
        objectId: string;
    }
    // to have the properties typed in the exported object
    interface SerializedObjectProps {
        objectId: string;
    }
}
