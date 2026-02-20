import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Send } from "lucide-react";

const formSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters."),
    email: z.string().email("Please enter a valid email address."),
    service: z.string().min(1, { message: "Please select a service of interest." }),
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

export default function ContactModal({
    children,
    triggerClassName,
    buttonText = "Get in Touch",
    variant = "default",
    size = "default"
}: ContactModalProps) {
    const [open, setOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            email: "",
            service: "",
            message: "",
        },
    });

    async function onSubmit(data: FormValues) {
        setIsSubmitting(true);

        try {
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });

            if (!response.ok) {
                throw new Error('Failed to send message');
            }

            toast.success("Message sent successfully!", {
                description: "We'll get back to you within 24 hours.",
            });

            setOpen(false);
            form.reset();
        } catch (error) {
            toast.error("Failed to send message", {
                description: "Please try again or email us directly at info@devedge.com.au"
            });
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {children || (
                    <Button variant={variant} size={size} className={triggerClassName}>
                        {buttonText}
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px] bg-card/95 backdrop-blur-xl border-white/10 shadow-2xl">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-display font-medium">Let's build something great.</DialogTitle>
                    <DialogDescription className="text-muted-foreground">
                        Fill out the form below and our team will get back to you within 24 hours.
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 mt-4">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-white/80">Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="John Doe" className="bg-black/50 border-white/10 focus-visible:ring-primary" {...field} />
                                    </FormControl>
                                    <FormMessage className="text-red-400" />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-white/80">Email</FormLabel>
                                    <FormControl>
                                        <Input type="email" placeholder="john@company.com" className="bg-black/50 border-white/10 focus-visible:ring-primary" {...field} />
                                    </FormControl>
                                    <FormMessage className="text-red-400" />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="service"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-white/80">Service of Interest</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger className="bg-black/50 border-white/10 focus-visible:ring-primary">
                                                <SelectValue placeholder="Select a service" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent className="bg-card border-white/10">
                                            <SelectItem value="custom-development">Custom Development</SelectItem>
                                            <SelectItem value="mobile-apps">Mobile Applications</SelectItem>
                                            <SelectItem value="cloud-migration">Cloud Migration</SelectItem>
                                            <SelectItem value="process-automation">Process Automation</SelectItem>
                                            <SelectItem value="other">Other</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage className="text-red-400" />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="message"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-white/80">Project Details</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Tell us a bit about your project goals and timeline..."
                                            className="resize-none h-24 bg-black/50 border-white/10 focus-visible:ring-primary"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage className="text-red-400" />
                                </FormItem>
                            )}
                        />

                        <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium rounded-full h-12 transition-all duration-300 shadow-[0_0_20px_-5px_var(--color-primary)]" disabled={isSubmitting}>
                            {isSubmitting ? "Sending..." : (
                                <>
                                    Send Message <Send className="ml-2 w-4 h-4" />
                                </>
                            )}
                        </Button>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
