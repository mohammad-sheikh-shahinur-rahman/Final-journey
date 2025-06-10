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
  name: z.string().min(1, "নাম আবশ্যক"),
  contactInfo: z.string().min(1, "যোগাযোগের তথ্য (ফোন/ইমেল) আবশ্যক"),
  message: z.string().min(1, "বার্তা আবশ্যক"),
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
      title: "অনুরোধ পাঠানো হয়েছে",
      description: `আপনার ${serviceName} এর জন্য অনুসন্ধান জমা দেওয়া হয়েছে। আমরা শীঘ্রই আপনার সাথে যোগাযোগ করব।`,
    });
    reset();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4 p-4 border rounded-md bg-card">
      <h4 className="font-semibold text-lg">{serviceName} এর জন্য যোগাযোগ করুন</h4>
      <div>
        <Label htmlFor={`name-${serviceName}`}>আপনার নাম</Label>
        <Input id={`name-${serviceName}`} {...register('name')} />
        {errors.name && <p className="text-destructive text-sm mt-1">{errors.name.message}</p>}
      </div>
      <div>
        <Label htmlFor={`contact-${serviceName}`}>আপনার ফোন/ইমেল</Label>
        <Input id={`contact-${serviceName}`} {...register('contactInfo')} />
        {errors.contactInfo && <p className="text-destructive text-sm mt-1">{errors.contactInfo.message}</p>}
      </div>
      <div>
        <Label htmlFor={`message-${serviceName}`}>বার্তা/প্রয়োজনীয়তা</Label>
        <Textarea id={`message-${serviceName}`} {...register('message')} rows={3} />
        {errors.message && <p className="text-destructive text-sm mt-1">{errors.message.message}</p>}
      </div>
      <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
        <MessageSquare className="mr-2 h-4 w-4" /> অনুসন্ধান পাঠান
      </Button>
    </form>
  );
}


const mockImams = [
  { id: 1, name: "ইমাম আবদুল্লাহ আল-মামুন", mosque: "বায়তুল মোকাররম জাতীয় মসজিদ এলাকা", phone: "01700-000001", expertise: "জানাজার নামাজ, ইসলামিক পরামর্শ", image: "https://placehold.co/100x100.png", dataAiHint: "man portrait" },
  { id: 2, name: "ইমাম হাসান মাহমুদ", mosque: "গুলশান সেন্ট্রাল মসজিদ এলাকা", phone: "01800-000002", expertise: "অন্ত্যেষ্টিক্রিয়া, কুরআন তিলাওয়াত", image: "https://placehold.co/100x100.png", dataAiHint: "elderly man"  },
  { id: 3, name: "ইমাম ফাতিমা খাতুন", mosque: "মোহাম্মদপুর এলাকা (মহিলা বিভাগ সমর্থন)", phone: "01900-000003", expertise: "মহিলা মৃতদেহ প্রস্তুতি, পরিবার সমর্থন", image: "https://placehold.co/100x100.png", dataAiHint: "woman portrait"  },
];

const additionalServices = [
  { 
    name: "কাফন সেট (দাফনের কাপড়)", 
    description: "পুরুষ ও মহিলাদের জন্য কাফনের সম্পূর্ণ সেট, ইসলামিক নির্দেশিকা অনুসারে। বিভিন্ন আকার ও উপকরণে উপলব্ধ।",
    icon: <Package className="h-8 w-8 text-primary" />
  },
  { 
    name: "অ্যাম্বুলেন্স পরিষেবা", 
    description: "মৃতদেহ মসজিদ, কবরস্থান বা অন্যান্য স্থানে পরিবহনের জন্য নির্ভরযোগ্য এবং সময়োপযোগী অ্যাম্বুলেন্স পরিষেবা। সম্মানজনক পরিবহনের জন্য সজ্জিত।",
    icon: <Ambulance className="h-8 w-8 text-primary" />
  },
  { 
    name: "দোয়েল টিম (দাফন সহায়তা)", 
    description: "দাফন প্রক্রিয়ায় সহায়তার জন্য অভিজ্ঞ দোয়েল টিম, কবর খোঁড়া এবং কবরস্থানে চূড়ান্ত আচার-অনুষ্ঠান সহ।",
    icon: <UsersRound className="h-8 w-8 text-primary" />
  },
  { 
    name: "দোয়া-মাহফিল (প্রার্থনা সমাবেশ)", 
    description: "মৃতের জন্য দোয়া-মাহফিলের আয়োজন, ইমাম পরিষেবা, স্থানের প্রস্তাবনা এবং প্রয়োজনীয় সরঞ্জাম সহ।",
    icon: <BookOpenText className="h-8 w-8 text-primary" />
  },
  { 
    name: "পারিবারিক আমন্ত্রণ ব্যবস্থা", 
    description: "এসএমএস, হোয়াটসঅ্যাপ বা ইমেলের মাধ্যমে আত্মীয়স্বজন এবং বন্ধুদের জানাজা এবং দাফনের বিবরণ সম্পর্কে জানাতে সহায়তা।",
    icon: <MailPlus className="h-8 w-8 text-primary" />
  },
];

export default function ServicesPage() {
  return (
    <div className="container mx-auto py-12 px-4 md:px-6">
      <section className="mb-16">
        <div className="text-center mb-10">
          <Landmark className="h-12 w-12 mx-auto text-primary mb-3" />
          <h1 className="text-4xl font-headline font-bold text-foreground">ইমাম খুঁজুন</h1>
          <p className="text-muted-foreground mt-2 md:text-lg">मार्गदर्शन এবং জানাজার নামাজের পরিষেবার জন্য অভিজ্ঞ ইমামদের সাথে সংযোগ করুন।</p>
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
                <p className="text-sm text-foreground mb-3"><strong>দক্ষতা:</strong> {imam.expertise}</p>
                <a href={`tel:${imam.phone}`} className="w-full">
                  <Button variant="outline" className="w-full border-primary text-primary hover:bg-primary/10">
                    <Phone className="mr-2 h-4 w-4" /> এখনই কল করুন
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
          <h1 className="text-4xl font-headline font-bold text-foreground">অতিরিক্ত অন্ত্যেষ্টিক্রিয়া পরিষেবা</h1>
          <p className="text-muted-foreground mt-2 md:text-lg">अंत्येष्टि ব্যবস্থা প্রক্রিয়া সহজ করতে বিভিন্ন সমর্থন পরিষেবা অ্যাক্সেস করুন।</p>
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
