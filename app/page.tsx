import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]/route";

import { columns } from "@/lib/column";
import { DataTable } from "@/components/ui/data-table";
import { fetchData } from "@/lib/fetch";
import HomeLayout from "@/components/home-layout";

export const description =
    "A products dashboard with a sidebar navigation and a main content area. The dashboard has a header with a search input and a user menu. The sidebar has a logo, navigation links, and a card with a call to action. The main content area shows an empty state with a call to action.";

export default async function Dashboard() {
    const session = await getServerSession(authOptions);
    const data = await fetchData(session?.user.accessToken);

    return (
        <HomeLayout>
            <DataTable columns={columns} data={data} />
        </HomeLayout>

        /* <div
                className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm"
                x-chunk="dashboard-02-chunk-1"
            >
                <div className="flex flex-col items-center gap-1 text-center">
                    <h3 className="text-2xl font-bold tracking-tight">
                        You have no products
                    </h3>
                    <p className="text-sm text-muted-foreground">
                        You can start selling as soon as you add a
                        product.
                    </p>
                    <Button className="mt-4">Add Product</Button>
                </div>
            </div> */
    );
}
