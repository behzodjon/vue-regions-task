import Region from "./Region";
import District from "./District";

export default interface FormData {
    region: Region | null;
    district: District | null;
    comment: string;
}
