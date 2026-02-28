import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Quote } from "lucide-react";

import testimonials from "@/data/testimonials.json";

export default function Testimonials() {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="container">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-primary font-mono text-sm tracking-wider uppercase mb-2 block">[05 Testimonials]</span>
          <h2 className="text-4xl md:text-5xl font-display font-bold mb-6">
            Real stories. Real winners. <span className="text-gradient">Straight from our clients.</span>
          </h2>
        </div>

        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full max-w-6xl mx-auto"
        >
          <CarouselContent className="-ml-4">
            {testimonials.map((testimonial, index) => (
              <CarouselItem key={index} className="pl-4 md:basis-1/2 lg:basis-1/3">
                <div className="h-full bg-card/30 border border-white/5 p-8 rounded-3xl flex flex-col relative group hover:bg-card/50 transition-colors">
                  <Quote className="absolute top-8 right-8 w-8 h-8 text-white/5 group-hover:text-primary/20 transition-colors" />

                  <div className="mb-6 grow">
                    <p className="text-muted-foreground leading-relaxed">"{testimonial.content}"</p>
                  </div>

                  <div className="flex items-center gap-4 pt-6 border-t border-white/5">
                    <div className="w-10 h-10 rounded-full bg-linear-to-br from-primary to-purple-600 flex items-center justify-center text-white font-bold text-sm">
                      {testimonial.name[0]}
                    </div>
                    <div>
                      <div className="font-bold text-white">{testimonial.name}</div>
                      <div className="text-xs text-muted-foreground">{testimonial.role}</div>
                    </div>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <div className="flex justify-center gap-4 mt-8">
            <CarouselPrevious className="static translate-y-0 bg-card/50 border-white/10 hover:bg-primary hover:text-white" />
            <CarouselNext className="static translate-y-0 bg-card/50 border-white/10 hover:bg-primary hover:text-white" />
          </div>
        </Carousel>
      </div>
    </section>
  );
}
