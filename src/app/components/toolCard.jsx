import Link from "next/link";


export default function ToolCard({ title, description, Icon, link }) {
  return (
    <Link href={link}>
      <div className="group flex-grow border border-[var(--border-color)] rounded-lg p-5 hover:border-[var(--hover-border)] duration-500 ease-in-out cursor-pointer bg-white h-full flex flex-col items-start justify-between">
     
        <div className="flex items-center gap-4">
          <Icon className="w-10 h-10 text-blue-600 group-hover:text-[var(--main-color)] transition-colors duration-300" />
          <h2 className="text-lg font-semibold">{title}</h2>
        </div>

        <p className="text-gray-600 text-sm mt-3">{description}</p>

        
        <div className="mt-4 text-black font-[body-font] font-medium opacity-0 group-hover:opacity-100 translate-y-1 group-hover:translate-y-0 transition-all duration-[0.5s] ease-in-out">
          Start Now →
        </div>
      </div>
    </Link>
  );
}
