

import { District, Region } from "./Location";

export default interface FormData {
    region: Region | null;
    district: District | null;
    comment: string;
}
