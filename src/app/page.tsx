import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Users, CalendarClock, HeartHandshake, Sparkles, Feather } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  const services = [
    {
      title: "Report a Death",
      description: "Submit essential details quickly and easily to initiate the necessary arrangements.",
      icon: <FileText className="h-10 w-10 text-primary mb-4" />,
      link: "/report-death",
      cta: "Submit Report"
    },
    {
      title: "AI Janaza Time Suggestion",
      description: "Get AI-powered suggestions for Janaza prayer times based on Islamic traditions and local schedules.",
      icon: <CalendarClock className="h-10 w-10 text-primary mb-4" />,
      link: "/report-death", // Or a dedicated page if preferred
      cta: "Get Suggestions"
    },
    {
      title: "Find Service Providers",
      description: "Connect with local Imams and other essential service providers for funeral rites.",
      icon: <Users className="h-10 w-10 text-primary mb-4" />,
      link: "/services",
      cta: "Find Providers"
    },
    {
      title: "Additional Support Services",
      description: "Access services like Kafan Sets, ambulance, Doyel teams, Dowa-Mahfil, and family invites.",
      icon: <HeartHandshake className="h-10 w-10 text-primary mb-4" />,
      link: "/services#additional-services",
      cta: "Explore Services"
    },
  ];

  return (
    <div className="flex flex-col items-center">
      {/* Hero Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-br from-primary/10 via-background to-background">
        <div className="container px-4 md:px-6 text-center">
          <Feather className="h-16 w-16 text-primary mx-auto mb-6" />
          <h1 className="text-4xl font-headline font-bold tracking-tighter sm:text-5xl md:text-6xl text-foreground">
            ShebaPlan: Guiding You Through Difficult Times
          </h1>
          <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl mt-6 mb-8">
            Compassionate and comprehensive funeral planning services in Bangladesh. We are here to support you with dignity and respect.
          </p>
          <Link href="/report-death">
            <Button size="lg" className="font-semibold bg-primary hover:bg-primary/90 text-primary-foreground">
              Get Started
            </Button>
          </Link>
        </div>
      </section>

      {/* Services Overview Section */}
      <section className="w-full py-12 md:py-24 lg:py-20">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
            <Sparkles className="h-12 w-12 text-accent mb-2" />
            <h2 className="text-3xl font-headline font-bold tracking-tighter sm:text-4xl text-foreground">Our Services</h2>
            <p className="max-w-[900px] text-muted-foreground md:text-lg lg:text-base xl:text-lg">
              We offer a range of services to help you navigate funeral arrangements with ease and peace of mind.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {services.map((service) => (
              <Card key={service.title} className="flex flex-col shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-xl overflow-hidden">
                <CardHeader className="items-center text-center bg-card">
                  {service.icon}
                  <CardTitle className="font-headline text-xl">{service.title}</CardTitle>
                </CardHeader>
                <CardContent className="flex-grow text-center bg-card">
                  <CardDescription className="text-muted-foreground mb-6">{service.description}</CardDescription>
                  <Link href={service.link}>
                    <Button variant="outline" className="w-full border-primary text-primary hover:bg-primary/10">
                      {service.cta}
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
      
      {/* Informational Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-secondary/50">
        <div className="container grid items-center gap-6 px-4 md:px-6 lg:grid-cols-2 lg:gap-10">
          <div className="space-y-4">
            <h2 className="text-3xl font-headline font-bold tracking-tighter md:text-4xl/tight text-foreground">
              Support and Guidance When You Need It Most
            </h2>
            <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              At ShebaPlan, we understand the emotional and logistical challenges that come with losing a loved one. Our platform is designed to simplify the funeral planning process, providing you with reliable information and connecting you to necessary services, all with utmost care and cultural sensitivity.
            </p>
            <ul className="grid gap-2 py-4">
              <li>
                <Feather className="mr-2 inline-block h-4 w-4 text-primary" />
                Clear, step-by-step guidance.
              </li>
              <li>
                <Feather className="mr-2 inline-block h-4 w-4 text-primary" />
                Access to verified service providers.
              </li>
              <li>
                <Feather className="mr-2 inline-block h-4 w-4 text-primary" />
                Respectful and culturally appropriate assistance.
              </li>
            </ul>
          </div>
          <Image
            src="https://placehold.co/600x400.png"
            alt="Peaceful Scene"
            data-ai-hint="serene landscape"
            width={600}
            height={400}
            className="mx-auto aspect-video overflow-hidden rounded-xl object-cover object-center sm:w-full lg:order-last"
          />
        </div>
      </section>
    </div>
  );
}
