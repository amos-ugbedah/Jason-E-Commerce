export default function JasonLogo({ className }) {
  return (
    <div className={`flex items-center ${className}`}>
      <div className="bg-blue-600 rounded-full w-10 h-10 flex items-center justify-center text-white font-bold text-xl mr-2">
        J
      </div>
      <span className="text-xl font-bold text-blue-600">JASON</span>
    </div>
  );
}
