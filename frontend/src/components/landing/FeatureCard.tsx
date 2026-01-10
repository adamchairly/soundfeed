import type { ReactNode } from "react";

interface FeatureCardProps {
  title: string;
  description?: string | ReactNode;
}

export const FeatureCard = ({ title, description }: FeatureCardProps) => {
  return (
    <div className="flex flex-col items-start p-6 bg-white border border-slate-200 rounded h-full">
      <h3 className="text-xl font-bold text-slate-900 mb-2">
        {title}
      </h3>
      
      {description && (
        <div className="text-slate-600 leading-relaxed">
          {description}
        </div>
      )}
    </div>
  );
};