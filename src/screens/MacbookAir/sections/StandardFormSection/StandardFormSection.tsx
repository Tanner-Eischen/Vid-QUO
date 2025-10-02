import React from "react";
import { Input } from "../../../../components/ui/input";
import { Label } from "../../../../components/ui/label";

export const StandardFormSection = (): JSX.Element => {
  const formFields = [
    {
      id: "crew-per-setup",
      label: "Crew per Setup (DP + Other) (1-7)",
      placeholder: "",
    },
    {
      id: "weight",
      label: "Weight (Production to Profit) (40-80%)",
      placeholder: "",
    },
    {
      id: "discount",
      label: "Discount (0-20%)",
      placeholder: "",
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      {formFields.map((field) => (
        <div key={field.id} className="flex flex-col gap-2">
          <Label className="font-bold [font-family:'Lexend',Helvetica] text-black text-lg tracking-[0] leading-[normal]">
            {field.label}
          </Label>
          <Input
            placeholder={field.placeholder}
            className="h-[61px] px-5 py-0 rounded-xl border border-solid border-[#5a5a5a] [font-family:'Lexend',Helvetica] font-normal text-black text-lg tracking-[0] leading-[normal]"
          />
        </div>
      ))}
    </div>
  );
};
