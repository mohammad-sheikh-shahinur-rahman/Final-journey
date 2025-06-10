export default function Footer() {
  return (
    <footer className="py-6 md:px-8 md:py-0 border-t">
      <div className="container flex flex-col items-center justify-between gap-4 md:h-20 md:flex-row">
        <p className="text-balance text-center text-sm leading-loose text-muted-foreground md:text-left">
          © {new Date().getFullYear()} সেবাপ্ল্যান। সর্বস্বত্ব সংরক্ষিত।
        </p>
        <p className="text-balance text-center text-sm leading-loose text-muted-foreground md:text-left">
          যাদের আমরা হারিয়েছি তাদের স্মরণে।
        </p>
      </div>
    </footer>
  );
}
