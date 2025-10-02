import React from "react";
import { Input } from "../../../../components/ui/input";
import { Label } from "../../../../components/ui/label";
import { Button } from "../../../../components/ui/button";
import { Minus, Plus } from "lucide-react";

export const PremiumFormSection = (): JSX.Element => {
  const formFields = [
    {
      id: "deliverables",
      label: "Number of Deliverables (1-7)",
      placeholder: "3 Deliverables",
      type: "text",
    },
    {
      id: "avg-length",
      label: "Average Length per Deliverable",
      placeholder: "4 Hr 30mins",
      type: "text",
    },
    {
      id: "hours-per-day",
      label: "Hours per Day (1-12)",
      placeholder: "4 Hr 30mins",
      type: "text",
    },
    {
      id: "locations",
      label: "Number of Locations (1-7)",
      placeholder: "5 Locations",
      type: "text",
    },
    {
      id: "miles",
      label: "Miles from Service Rep (0-300)",
      placeholder: "",
      type: "text",
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-2 gap-x-8 gap-y-6">
        <div className="flex flex-col gap-2">
          <Label className="font-bold [font-family:'Lexend',Helvetica] text-black text-lg tracking-[0] leading-[normal]">
            {formFields[0].label}
          </Label>
          <Input
            placeholder={formFields[0].placeholder}
            className="h-[61px] px-5 py-0 rounded-xl border border-solid border-[#5a5a5a] [font-family:'Lexend',Helvetica] font-normal text-black text-lg tracking-[0] leading-[normal]"
          />
        </div>

        <div className="flex flex-col gap-2">
          <Label className="font-bold [font-family:'Lexend',Helvetica] text-black text-lg tracking-[0] leading-[normal]">
            {formFields[1].label}
          </Label>
          <Input
            placeholder={formFields[1].placeholder}
            className="h-[61px] px-5 py-0 rounded-xl border border-solid border-[#5a5a5a] [font-family:'Lexend',Helvetica] font-normal text-black text-lg tracking-[0] leading-[normal]"
          />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <Label className="font-bold [font-family:'Lexend',Helvetica] text-black text-lg tracking-[0] leading-[normal]">
          Filming Days (1-7)
        </Label>
        <div className="flex items-center gap-4 h-[61px] px-5 rounded-xl border border-solid border-[#5a5a5a]">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-full hover:bg-gray-100"
          >
            <Minus className="h-4 w-4" />
          </Button>
          <span className="flex-1 text-center [font-family:'Lexend',Helvetica] font-normal text-black text-lg">
            3
          </span>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-full hover:bg-gray-100"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-x-8 gap-y-6">
        <div className="flex flex-col gap-2">
          <Label className="font-bold [font-family:'Lexend',Helvetica] text-black text-lg tracking-[0] leading-[normal]">
            {formFields[2].label}
          </Label>
          <Input
            placeholder={formFields[2].placeholder}
            className="h-[61px] px-5 py-0 rounded-xl border border-solid border-[#5a5a5a] [font-family:'Lexend',Helvetica] font-normal text-black text-lg tracking-[0] leading-[normal]"
          />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <Label className="font-bold [font-family:'Lexend',Helvetica] text-black text-lg tracking-[0] leading-[normal]">
          {formFields[3].label}
        </Label>
        <Input
          placeholder={formFields[3].placeholder}
          className="h-[61px] px-5 py-0 rounded-xl border border-solid border-[#5a5a5a] [font-family:'Lexend',Helvetica] font-normal text-black text-lg tracking-[0] leading-[normal]"
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label className="font-bold [font-family:'Lexend',Helvetica] text-black text-lg tracking-[0] leading-[normal]">
          {formFields[4].label}
        </Label>
        <Input
          placeholder={formFields[4].placeholder}
          className="h-[61px] px-5 py-0 rounded-xl border border-solid border-[#5a5a5a] [font-family:'Lexend',Helvetica] font-normal text-black text-lg tracking-[0] leading-[normal]"
        />
      </div>
    </div>
  );
};
