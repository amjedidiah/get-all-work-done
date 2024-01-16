"use client";
import { business_types, platform_name } from "@/constants";
import useRegisterForm from "@/hooks/use-register-form";

export default function RegisterForm() {
  const {
    formSubmit,
    handleFormChange,
    formValues,
    formResponse,
    isIndividual,
  } = useRegisterForm();

  return (
    <form className="grid gap-5 max-w-xl" onSubmit={formSubmit}>
      <div className="grid gap-1">
        <label className="uppercase text-xs font-semibold" htmlFor="email">
          Personal Email Address
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
      <div className="grid gap-1">
        <label className="uppercase text-xs font-semibold" htmlFor="dob_string">
          Date of birth
        </label>
        <input
          className="border border-slate-700 p-2"
          type="date"
          name="dob_string"
          id="dob_string"
          value={formValues.dob_string}
          onChange={handleFormChange}
        />
      </div>
      <div className="grid gap-1">
        <label
          className="uppercase text-xs font-semibold"
          htmlFor="business_type"
        >
          Business Type
        </label>
        <select
          className="border border-slate-700 p-2"
          name="business_type"
          id="business_type"
          value={formValues.business_type}
          onChange={handleFormChange}
        >
          {business_types.map((type) => {
            const label = type.split("_").join(" ");
            return (
              <option key={type} value={type} className="capitalize">
                {label}
              </option>
            );
          })}
        </select>
      </div>

      {!isIndividual && (
        <div className="grid gap-1">
          <label
            className="uppercase text-xs font-semibold"
            htmlFor="company_name"
          >
            Company Name
          </label>
          <input
            className="border border-slate-700 p-2"
            type="text"
            name="company_name"
            id="company_name"
            placeholder={`e.g: ${platform_name}`}
            value={formValues.company_name}
            onChange={handleFormChange}
          />
        </div>
      )}

      <button className="bg-slate-700 text-white px-4 py-2 w-fit uppercase font-semibold">
        Submit
      </button>

      {/*/Disabled checked checkbox for agreeing to terms and conditions */}
      <div className="flex items-center mt-5">
        <input
          className="mr-2"
          type="checkbox"
          name="agree_to_terms"
          id="agree_to_terms"
          value="true"
          checked
          disabled
        />
        <label className="text-xs" htmlFor="agree_to_terms">
          I agree to the{" "}
          <a
            className="text-blue-500 underline"
            href="https://www.notion.so/Terms-of-Service-916770687908
          -1865014e909648468987056c2862
          41621"
            target="_blank"
            rel="noopener noreferrer"
          >
            Terms of Service and Privacy Policy
          </a>
        </label>
      </div>

      <p>{formResponse}</p>
    </form>
  );
}
