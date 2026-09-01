interface propsType {
  icon: React.ReactNode;
  title: string;
  desc: string;
}

const FeatureCard = ({ icon, title, desc }: propsType) => {
  return (
    <div className="flex items-center gap-4 bg-white p-5 rounded-2xl border border-gray-100/80 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 group">
      <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center text-2xl shrink-0 group-hover:bg-primary group-hover:text-white transition-colors duration-300">
        {icon}
      </div>

      <div className="min-w-0">
        <h3 className="font-bold text-gray-900 text-sm md:text-base leading-snug group-hover:text-primary transition-colors duration-200">{title}</h3>
        <p className="text-gray-500 text-xs mt-0.5 leading-relaxed">{desc}</p>
      </div>
    </div>
  );
};

export default FeatureCard;