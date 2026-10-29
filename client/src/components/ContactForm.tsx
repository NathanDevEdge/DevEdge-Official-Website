import { useState } from "react";
import { useForm } from "react-hook-form";
import type { FieldErrors, Resolver } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { toast } from "sonner";
import { Send } from "lucide-react";
import { trackEvent } from "@/lib/analytics";
import { SERVICES } from "@/data/services";

type FormValues = { name: string; email: string; phone?: string; services: string[]; message: string };

// Plain validation (a schema library would add ~60KB to every page for five fields)
const resolver: Resolver<FormValues> = async (values) => {
  const errors: FieldErrors<FormValues> = {};
  const fail = (field: keyof FormValues, message: string) => (errors[field] = { type: "validate", message });
  if (values.name.trim().length < 2) fail("name", "Name must be at least 2 characters.");
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) fail("email", "Please enter a valid email address.");
  if (values.services.length < 1) fail("services", "Pick at least one, or \"Not sure yet\".");
  if (values.message.trim().length < 10) fail("message", "Message must be at least 10 characters.");
  return Object.keys(errors).length ? { values: {}, errors } : { values, errors: {} };
};

const serviceOptions = [...SERVICES.map((s) => s.name), "Not sure yet"];

/** The enquiry form, used in the contact modal and on /contact */
export default function ContactForm({ onSuccess }: { onSuccess?: () => void }) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormValues>({
    resolver,
    defaultValues: { name: "", email: "", phone: "", services: [], message: "" },
  });

  async function onSubmit(data: FormValues) {
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          phone: data.phone,
          service: data.services.join(", "),
          message: data.message,
        }),
      });
      if (!response.ok) throw new Error("Failed to send message");
      trackEvent("generate_lead", { form: "contact", service: data.services.join(", ") });
      toast.success("Message sent!", {
        description: "We'll get back to you within 24 hours.",
      });
      form.reset();
      onSuccess?.();
    } catch {
      toast.error("Failed to send message", {
        description: "Please try again or email info@devedge.com.au",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  const fieldClass =
    "w-full h-11 px-4 bg-[#F5E6D5] border border-[#D4B896] text-[#1A1008] placeholder:text-[#A89070] font-sans text-[14px] outline-none focus:border-[#C97B3A] transition-colors duration-150 rounded-none";

  return (
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

        {/* Email + Phone — side by side */}
        <div className="grid grid-cols-2 gap-4">
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

          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-mono text-[11px] text-[#7A5C3A] tracking-widest uppercase inline-flex items-center gap-2">
                  Phone
                  <span className="text-[#A89070] normal-case tracking-normal font-sans" style={{ fontSize: "10px" }}>
                    optional
                  </span>
                </FormLabel>
                <FormControl>
                  <input
                    type="tel"
                    placeholder="0400 000 000"
                    className={fieldClass}
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-[#c0392b] text-xs font-mono" />
              </FormItem>
            )}
          />
        </div>

        {/* Services */}
        <FormField
          control={form.control}
          name="services"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-mono text-[11px] text-[#7A5C3A] tracking-widest uppercase">
                What do you need help with?
              </FormLabel>
              <FormControl>
                <div className="flex flex-wrap gap-2" role="group" aria-label="Services">
                  {serviceOptions.map((option) => {
                    const selected = field.value.includes(option);
                    return (
                      <button
                        key={option}
                        type="button"
                        aria-pressed={selected}
                        onClick={() =>
                          field.onChange(
                            selected ? field.value.filter((v) => v !== option) : [...field.value, option],
                          )
                        }
                        className={`px-3 py-2 text-[13px] border transition-colors duration-150 ${
                          selected
                            ? "bg-[#C97B3A] border-[#C97B3A] text-[#1A1008] font-semibold"
                            : "bg-transparent border-[#D4B896] text-[#7A5C3A] hover:border-[#C97B3A]"
                        }`}
                      >
                        {option}
                      </button>
                    );
                  })}
                </div>
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
  );
}
