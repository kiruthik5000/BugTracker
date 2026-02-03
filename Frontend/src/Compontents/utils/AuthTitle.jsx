import React from "react";

const AuthTitle = ({ title, subtitle }) => {
  return (
    <div>
      <h2 className="text-2xl font-semibold text-white">{title}</h2>
      <p className="mt-2 text-sm text-slate-400">{subtitle}</p>
    </div>
  );
};

export default AuthTitle;
