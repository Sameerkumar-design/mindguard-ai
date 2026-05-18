export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-black relative overflow-hidden">
      {/* Background ambient gradients */}
      <div className="absolute top-[-30%] left-[-20%] w-[60%] h-[60%] rounded-full bg-purple-900/20 blur-[140px] pointer-events-none" />
      <div className="absolute bottom-[-30%] right-[-20%] w-[60%] h-[60%] rounded-full bg-blue-900/15 blur-[140px] pointer-events-none" />

      {/* Grid pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />

      {children}
    </div>
  );
}
