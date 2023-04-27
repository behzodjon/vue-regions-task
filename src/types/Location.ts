export default interface Location {
    id: number;
    name: string;
}

export interface District extends Location { }

export interface Region extends Location { }
