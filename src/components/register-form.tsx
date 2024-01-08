import { business_types, platform_name } from "@/constants";
import useToken from "@/hooks/use-token";
import { BusinessTypeEnum, RegisterFormValues } from "@/types";
import {
  extractDOB,
  getIsIndividual,
  validateBusinessType,
  validateDOB,
  validateEmailClient,
  validateName,
} from "@/utils";
import { useEffect, useMemo, useState } from "react";

const initialValues: RegisterFormValues = {
  email: "",
  dob_string: "",
  business_type: BusinessTypeEnum.individual,
  company_name: "",
};

const formatValues = ({ dob_string, ...rest }: RegisterFormValues) => {
  const dob = extractDOB(dob_string);

  return { ...rest, dob };
};

export default function RegisterForm() {
  const generateToken = useToken();
  const [formValues, setFormValues] =
    useState<RegisterFormValues>(initialValues);
  const [formResponse, setFormResponse] = useState("");
  const isIndividual = useMemo(
    () => getIsIndividual(formValues.business_type),
    [formValues.business_type]
  );

  const handleFormChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = event.currentTarget;
    setFormValues({
      ...formValues,
      [name]: value,
    });
  };

  async function handleFormSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      // 1. Format values
      const { business_type, company_name, ...person } =
        formatValues(formValues);
      const company = company_name
        ? {
            name: company_name,
          }
        : undefined;

      // 2. Validations
      await validateEmailClient(person.email);
      validateDOB(person.dob);
      validateBusinessType(business_type);
      if (!isIndividual) validateName("Company Name", company_name);

      // 3. Generate token(s)
      const tokens = await generateToken(business_type, person, company);

      console.log(tokens);
    } catch (error: any) {
      setFormResponse(error?.message ?? error ?? "Something went wrong");
    } finally {
      setTimeout(() => {
        setFormResponse("");
      }, 5000);
    }
  }

  useEffect(() => {
    if (isIndividual)
      setFormValues((prev) => ({
        ...prev,
        company_name: "",
      }));
  }, [isIndividual]);

  return (
    <form className="grid gap-5 max-w-xl" onSubmit={handleFormSubmit}>
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

      <p>{formResponse}</p>
    </form>
  );
}
