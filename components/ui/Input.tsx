import { InputHTMLAttributes } from "react";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
};

export default function Input({ label, id, ...props }: InputProps) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-neutral-700">
        {label}
      </label>
      <input
        id={id}
        className="mt-1 w-full rounded-lg border border-neutral-300 px-4 py-2 focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold"
        {...props}
      />
    </div>
  );
}