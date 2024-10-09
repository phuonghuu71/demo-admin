"use client";

import { ColumnDef } from "@tanstack/react-table";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Vehicle = {
    vin: string;
    name: string;
    model: string;
    model_year: number;
};

export const columns: ColumnDef<Vehicle>[] = [
    {
        accessorKey: "vin",
        header: "VIN",
    },
    {
        accessorKey: "name",
        header: "Name",
    },
    {
        accessorKey: "model",
        header: "Model",
    },
    {
        accessorKey: "model_year",
        header: "Model Year",
    },
];
