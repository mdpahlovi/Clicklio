export default function Footer() {
    const year = new Date().getFullYear();

    return (
        <footer className="mt-12 sm:mt-14 lg:mt-16 border-t">
            <section className="h-16 my-0 flex justify-between items-center gap-6">
                <div className="w-full py-6 text-sm text-center">© {year} Company Co. All rights reserved.</div>
            </section>
        </footer>
    );
}
