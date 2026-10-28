import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import ContactForm from "@/components/ContactForm";

interface ContactModalProps {
  children?: React.ReactNode;
  triggerClassName?: string;
  buttonText?: string;
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
}

export default function ContactModal({
  children,
  triggerClassName,
  buttonText = "Get in Touch",
  variant = "default",
  size = "default",
}: ContactModalProps) {
  const [open, setOpen] = useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button variant={variant} size={size} className={triggerClassName}>
            {buttonText}
          </Button>
        )}
      </DialogTrigger>

      <DialogContent className="sm:max-w-[480px] bg-[#FBEFD9] border border-[#D4B896] shadow-[0_24px_80px_rgba(46,31,15,0.18)] rounded-none p-0 gap-0">
        {/* Header */}
        <div className="px-8 pt-8 pb-6 border-b border-[#D4B896]">
          <DialogHeader>
            <DialogTitle className="font-display font-black text-[#1A1008] text-2xl leading-tight mb-1">
              Let's build something great.
            </DialogTitle>
            <DialogDescription className="text-[#7A5C3A] text-[14px] leading-relaxed">
              Fill out the form and we'll get back to you within 24 hours.
            </DialogDescription>
          </DialogHeader>
        </div>

        {/* Form */}
        <div className="px-8 py-6">
          <ContactForm onSuccess={() => setOpen(false)} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
