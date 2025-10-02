import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Card, CardContent } from "../../../../components/ui/card";

export const NavigationSection = (): JSX.Element => {
  const location = useLocation();
  const navigate = useNavigate();

  const navigationItems = [
    {
      id: "basic",
      title: "Basic",
      path: "/basic",
      icon: "1",
    },
    {
      id: "standard",
      title: "Standard",
      path: "/standard",
      icon: "2",
    },
    {
      id: "premium",
      title: "Premium",
      path: "/premium",
      icon: "3",
    },
  ];

  return (
    <nav className="flex flex-col w-[277px]">
      {navigationItems.map((item, index) => {
        const isSelected = location.pathname === item.path;
        const bgColor = isSelected ? "bg-[#ffffff]" : "bg-[#ffffff4c]";
        const shadow = isSelected ? "shadow-[0px_4px_4px_#00000040]" : "";
        const fontWeight = isSelected ? "font-bold" : "font-normal";

        return (
          <div key={item.id} className="flex flex-col">
            <Card
              className={`w-[277px] h-20 ${bgColor} rounded-[10px] ${shadow} border-0 cursor-pointer hover:bg-[#ffffff] transition-colors`}
              onClick={() => navigate(item.path)}
            >
              <CardContent className="p-0 relative h-full">
                <div
                  className={`absolute top-[25px] left-20 [font-family:'Lexend',Helvetica] ${fontWeight} text-[#023c97] text-[25px] tracking-[0] leading-[normal]`}
                >
                  {item.title}
                </div>

                {isSelected ? (
                  <img
                    className="absolute top-[18px] left-[19px] w-11 h-11"
                    alt="Group"
                    src="/group-26.png"
                  />
                ) : (
                  <div className="absolute top-[18px] left-[19px] w-[46px] h-11">
                    <div className="absolute top-0 left-0 w-11 h-11 bg-[#2cacba] rounded-[22px]" />
                    <div className="absolute top-1.5 left-[15px] [font-family:'Lexend',Helvetica] font-normal text-[#023c97] text-[25px] tracking-[0] leading-[normal]">
                      {item.icon}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {index < navigationItems.length - 1 && (
              <div className="ml-9 w-[9px] h-[100px] bg-[#2cacba]" />
            )}
          </div>
        );
      })}
    </nav>
  );
};
