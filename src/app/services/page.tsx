'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Landmark, UsersRound, Package, Ambulance, BookOpenText, MailPlus, Phone, MessageSquare } from "lucide-react";
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useToast } from "@/hooks/use-toast";
import Image from "next/image";

const contactFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  contactInfo: z.string().min(1, "Contact info (phone/email) is required"),
  message: z.string().min(1, "Message is required"),
  serviceType: z.string(),
});
type ContactFormValues = z.infer<typeof contactFormSchema>;

interface ContactServiceFormProps {
  serviceName: string;
}

function ContactServiceForm({ serviceName }: ContactServiceFormProps) {
  const { toast } = useToast();
  const { register, handleSubmit, formState: { errors }, reset } = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: { serviceType: serviceName }
  });

  const onSubmit: SubmitHandler<ContactFormValues> = (data) => {
    console.log("Contact form submitted for " + serviceName + ":", data);
    toast({
      title: "Request Sent",
      description: `Your inquiry for ${serviceName} has been submitted. We will contact you shortly.`,
    });
    reset();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4 p-4 border rounded-md bg-card">
      <h4 className="font-semibold text-lg">Contact for {serviceName}</h4>
      <div>
        <Label htmlFor={`name-${serviceName}`}>Your Name</Label>
        <Input id={`name-${serviceName}`} {...register('name')} />
        {errors.name && <p className="text-destructive text-sm mt-1">{errors.name.message}</p>}
      </div>
      <div>
        <Label htmlFor={`contact-${serviceName}`}>Your Phone/Email</Label>
        <Input id={`contact-${serviceName}`} {...register('contactInfo')} />
        {errors.contactInfo && <p className="text-destructive text-sm mt-1">{errors.contactInfo.message}</p>}
      </div>
      <div>
        <Label htmlFor={`message-${serviceName}`}>Message/Requirements</Label>
        <Textarea id={`message-${serviceName}`} {...register('message')} rows={3} />
        {errors.message && <p className="text-destructive text-sm mt-1">{errors.message.message}</p>}
      </div>
      <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
        <MessageSquare className="mr-2 h-4 w-4" /> Send Inquiry
      </Button>
    </form>
  );
}


const mockImams = [
  { id: 1, name: "Imam Abdullah Al-Mamun", mosque: "Baitul Mukarram National Mosque Area", phone: "01700-000001", expertise: "Janaza prayer, Islamic counseling", image: "https://placehold.co/100x100.png", dataAiHint: "man portrait" },
  { id: 2, name: "Imam Hasan Mahmud", mosque: "Gulshan Central Mosque Area", phone: "01800-000002", expertise: "Funeral rites, Quran recitation", image: "https://placehold.co/100x100.png", dataAiHint: "elderly man"  },
  { id: 3, name: "Imam Fatima Khatun", mosque: "Mohammadpur Area (Female Section Support)", phone: "01900-000003", expertise: "Female deceased preparations, family support", image: "https://placehold.co/100x100.png", dataAiHint: "woman portrait"  },
];

const additionalServices = [
  { 
    name: "Kafan Set (Burial Shroud)", 
    description: "Complete sets of Kafan (burial shroud) for male and female, adhering to Islamic guidelines. Available in various sizes and materials.",
    icon: <Package className="h-8 w-8 text-primary" />
  },
  { 
    name: "Ambulance Service", 
    description: "Reliable and timely ambulance services for transporting the deceased to the mosque, graveyard, or other locations. Equipped for respectful transport.",
    icon: <Ambulance className="h-8 w-8 text-primary" />
  },
  { 
    name: "Doyel Team (Burial Assistance)", 
    description: "Experienced Doyel teams to assist with the Dafan (burial) process, including grave digging and final rites at the cemetery.",
    icon: <UsersRound className="h-8 w-8 text-primary" />
  },
  { 
    name: "Dowa-Mahfil (Prayer Gathering)", 
    description: "Arrangements for Dowa-Mahfil (prayer gatherings for the deceased) including Imam services, venue suggestions, and necessary logistics.",
    icon: <BookOpenText className="h-8 w-8 text-primary" />
  },
  { 
    name: "Family Invite System", 
    description: "Assistance in informing relatives and friends about the Janaza and burial details through SMS, WhatsApp, or Email.",
    icon: <MailPlus className="h-8 w-8 text-primary" />
  },
];

export default function ServicesPage() {
  return (
    <div className="container mx-auto py-12 px-4 md:px-6">
      <section className="mb-16">
        <div className="text-center mb-10">
          <Landmark className="h-12 w-12 mx-auto text-primary mb-3" />
          <h1 className="text-4xl font-headline font-bold text-foreground">Find an Imam</h1>
          <p className="text-muted-foreground mt-2 md:text-lg">Connect with experienced Imams for guidance and funeral prayer services.</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {mockImams.map(imam => (
            <Card key={imam.id} className="shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-xl overflow-hidden">
              <CardHeader className="bg-card p-0">
                 <Image src={imam.image} alt={imam.name} data-ai-hint={imam.dataAiHint} width={400} height={200} className="w-full h-48 object-cover"/>
              </CardHeader>
              <CardContent className="p-6 bg-card">
                <CardTitle className="font-headline text-xl mb-1">{imam.name}</CardTitle>
                <CardDescription className="text-sm text-muted-foreground mb-1">{imam.mosque}</CardDescription>
                <p className="text-sm text-foreground mb-3"><strong>Expertise:</strong> {imam.expertise}</p>
                <a href={`tel:${imam.phone}`} className="w-full">
                  <Button variant="outline" className="w-full border-primary text-primary hover:bg-primary/10">
                    <Phone className="mr-2 h-4 w-4" /> Call Now
                  </Button>
                </a>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section id="additional-services">
        <div className="text-center mb-10 pt-10">
          <UsersRound className="h-12 w-12 mx-auto text-primary mb-3" />
          <h1 className="text-4xl font-headline font-bold text-foreground">Additional Funeral Services</h1>
          <p className="text-muted-foreground mt-2 md:text-lg">Access a range of support services to ease the funeral arrangement process.</p>
        </div>
        <Accordion type="single" collapsible className="w-full max-w-3xl mx-auto">
          {additionalServices.map(service => (
            <AccordionItem value={service.name} key={service.name}>
              <AccordionTrigger className="text-lg font-semibold hover:no-underline py-4 px-2 rounded-md hover:bg-muted/50 transition-colors">
                <div className="flex items-center">
                  {service.icon}
                  <span className="ml-3">{service.name}</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-2 pb-4">
                <p className="text-muted-foreground mb-4">{service.description}</p>
                <ContactServiceForm serviceName={service.name} />
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>
    </div>
  );
}
