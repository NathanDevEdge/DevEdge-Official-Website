import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { toast } from "sonner";
import { Send } from "lucide-react";

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  email: z.string().email("Please enter a valid email address."),
  service: z.string().min(1, "Please select a service of interest."),
  message: z.string().min(10, "Message must be at least 10 characters."),
});

type FormValues = z.infer<typeof formSchema>;

interface ContactModalProps {
  children?: React.ReactNode;
  triggerClassName?: string;
  buttonText?: string;
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
}

const services = [
  { value: "custom-development", label: "Custom Development" },
  { value: "web-platform", label: "Web Platform" },
  { value: "system-integration", label: "System Integration" },
  { value: "process-automation", label: "Process Automation" },
  { value: "cloud-migration", label: "Cloud Migration" },
  { value: "other", label: "Other" },
];

export default function ContactModal({
  children,
  triggerClassName,
  buttonText = "Get in Touch",
  variant = "default",
  size = "default",
}: ContactModalProps) {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: "", email: "", service: "", message: "" },
  });

  async function onSubmit(data: FormValues) {
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Failed to send message");
      toast.success("Message sent!", {
        description: "We'll get back to you within 24 hours.",
      });
      setOpen(false);
      form.reset();
    } catch {
      toast.error("Failed to send message", {
        description: "Please try again or email nathan@devedge.com.au",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  const fieldClass =
    "w-full h-11 px-4 bg-[#F5E6D5] border border-[#D4B896] text-[#1A1008] placeholder:text-[#A89070] font-sans text-[14px] outline-none focus:border-[#C97B3A] transition-colors duration-150 rounded-none";

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
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">

              {/* Name */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-mono text-[11px] text-[#7A5C3A] tracking-widest uppercase">
                      Name
                    </FormLabel>
                    <FormControl>
                      <input
                        placeholder="John Doe"
                        className={fieldClass}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-[#c0392b] text-xs font-mono" />
                  </FormItem>
                )}
              />

              {/* Email */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-mono text-[11px] text-[#7A5C3A] tracking-widest uppercase">
                      Email
                    </FormLabel>
                    <FormControl>
                      <input
                        type="email"
                        placeholder="john@company.com"
                        className={fieldClass}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-[#c0392b] text-xs font-mono" />
                  </FormItem>
                )}
              />

              {/* Service */}
              <FormField
                control={form.control}
                name="service"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-mono text-[11px] text-[#7A5C3A] tracking-widest uppercase">
                      Service of Interest
                    </FormLabel>
                    <FormControl>
                      <select
                        className={`${fieldClass} cursor-pointer appearance-none`}
                        {...field}
                      >
                        <option value="" disabled>Select a service</option>
                        {services.map((s) => (
                          <option key={s.value} value={s.value}>{s.label}</option>
                        ))}
                      </select>
                    </FormControl>
                    <FormMessage className="text-[#c0392b] text-xs font-mono" />
                  </FormItem>
                )}
              />

              {/* Message */}
              <FormField
                control={form.control}
                name="message"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-mono text-[11px] text-[#7A5C3A] tracking-widest uppercase">
                      Project Details
                    </FormLabel>
                    <FormControl>
                      <textarea
                        placeholder="Tell us a bit about your project goals and timeline..."
                        rows={4}
                        className={`${fieldClass} h-auto py-3 resize-none`}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-[#c0392b] text-xs font-mono" />
                  </FormItem>
                )}
              />

              {/* Submit */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-12 bg-[#C97B3A] hover:bg-[#b8692e] text-[#1A1008] font-semibold text-[15px] flex items-center justify-center gap-2 transition-colors duration-150 disabled:opacity-60 disabled:cursor-not-allowed mt-2"
              >
                {isSubmitting ? "Sending..." : (
                  <>Send Message <Send className="w-4 h-4" /></>
                )}
              </button>

            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
