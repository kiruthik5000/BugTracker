import React from "react";

const AuthButton = ({ children, type = "submit" }) => {
  return (
    <button
      type={type}
      className="w-full rounded-xl bg-cyan-400 px-4 py-3 text-sm font-semibold text-slate-900 transition hover:bg-cyan-300 active:translate-y-[1px]"
    >
      {children}
    </button>
  );
};

export default AuthButton;
