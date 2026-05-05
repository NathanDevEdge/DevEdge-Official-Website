import { useTheme } from "next-themes";
import { Toaster as Sonner, type ToasterProps } from "sonner";

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      position="bottom-right"
      toastOptions={{
        classNames: {
          toast:
            "!bg-[#FBEFD9] !border !border-[#D4B896] !rounded-none !shadow-[0_8px_32px_rgba(46,31,15,0.14)] !font-sans",
          title: "!text-[#1A1008] !font-semibold !text-[14px]",
          description: "!text-[#7A5C3A] !text-[13px]",
          success: "!border-l-2 !border-l-[#C97B3A]",
          error: "!border-l-2 !border-l-[#c0392b]",
          icon: "[&_svg]:!text-[#C97B3A]",
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
