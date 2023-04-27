import Province from "./Province";
import Region from "./Region";

export default interface FormData {
    province: Province | null;
    region: Region | null;
    comment: string;
}
