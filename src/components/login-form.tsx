"use client";
import useLoginForm from "@/hooks/use-login-form";

export default function LoginForm() {
  const { formSubmit, handleFormChange, formValues, formResponse } =
    useLoginForm();

  return (
    <form className="grid gap-5 max-w-xl" onSubmit={formSubmit}>
      <div className="grid gap-1">
        <label className="uppercase text-xs font-semibold" htmlFor="email">
          Account Email Address
        </label>
        <input
          className="border border-slate-700 p-2"
          type="email"
          name="email"
          id="email"
          placeholder="e.g: jane.doe@example.com"
          value={formValues.email}
          onChange={handleFormChange}
        />
      </div>

      <button className="bg-slate-700 text-white px-4 py-2 w-fit uppercase font-semibold">
        Submit
      </button>

      <p>{formResponse}</p>
    </form>
  );
}
