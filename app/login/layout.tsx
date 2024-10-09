export default function DashboardLayout({
    children, // will be a page or nested layout
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="w-screen h-screen justify-center flex items-center">
            {children}
        </div>
    );
}
