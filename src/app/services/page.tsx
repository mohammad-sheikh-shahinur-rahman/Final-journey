
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
import { cn } from "@/lib/utils";

const contactFormSchema = z.object({
  name: z.string().min(1, "নাম আবশ্যক"),
  contactInfo: z.string().min(1, "যোগাযোগের তথ্য (ফোন/ইমেল) আবশ্যক"),
  message: z.string().min(1, "বার্তা আবশ্যক"),
  serviceType: z.string(), // Hidden field to track which service the form is for
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
    // In a real app, you would send this data to a backend.
    console.log("Contact form submitted for " + serviceName + ":", data);
    toast({
      title: "অনুসন্ধান পাঠানো হয়েছে",
      description: `আপনার "${serviceName}" পরিষেবার জন্য অনুসন্ধান সফলভাবে জমা দেওয়া হয়েছে। আমরা শীঘ্রই আপনার সাথে যোগাযোগ করব।`,
    });
    reset(); // Reset form fields after submission
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4 p-4 border rounded-md bg-card shadow">
      <h4 className="font-semibold text-lg text-center text-primary">এই পরিষেবার জন্য যোগাযোগ করুন</h4>
      <input type="hidden" {...register('serviceType')} />
      <div>
        <Label htmlFor={`name-${serviceName.replace(/\s+/g, '-')}`}>আপনার নাম</Label>
        <Input id={`name-${serviceName.replace(/\s+/g, '-')}`} {...register('name')} placeholder="আপনার সম্পূর্ণ নাম লিখুন" />
        {errors.name && <p className="text-destructive text-sm mt-1">{errors.name.message}</p>}
      </div>
      <div>
        <Label htmlFor={`contactInfo-${serviceName.replace(/\s+/g, '-')}`}>আপনার ফোন নম্বর বা ইমেল</Label>
        <Input id={`contactInfo-${serviceName.replace(/\s+/g, '-')}`} {...register('contactInfo')} placeholder="ফোন নম্বর অথবা ইমেল ঠিকানা" />
        {errors.contactInfo && <p className="text-destructive text-sm mt-1">{errors.contactInfo.message}</p>}
      </div>
      <div>
        <Label htmlFor={`message-${serviceName.replace(/\s+/g, '-')}`}>আপনার বার্তা বা প্রয়োজনীয়তা</Label>
        <Textarea id={`message-${serviceName.replace(/\s+/g, '-')}`} {...register('message')} rows={3} placeholder="আপনার প্রয়োজনীয়তা বিস্তারিত লিখুন" />
        {errors.message && <p className="text-destructive text-sm mt-1">{errors.message.message}</p>}
      </div>
      <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
        <MessageSquare className="mr-2 h-4 w-4" /> অনুসন্ধান পাঠান
      </Button>
    </form>
  );
}


const mockImams = [
  { id: 1, name: "ইমাম আবদুল্লাহ আল-মামুন", mosque: "বায়তুল মোকাররম জাতীয় মসজিদ এলাকা, ঢাকা", phone: "01700-000001", expertise: "জানাজার নামাজ, ইসলামিক পরামর্শ, শোকসভা পরিচালনা", image: "https://placehold.co/300x200.png", dataAiHint: "man portrait" },
  { id: 2, name: "ইমাম হাসান মাহমুদ", mosque: "গুলশান সেন্ট্রাল মসজিদ এলাকা, ঢাকা", phone: "01800-000002", expertise: "দাফন প্রক্রিয়া তত্ত্বাবধান, কুরআন তিলাওয়াত, ধর্মীয় আলোচনা", image: "https://placehold.co/300x200.png", dataAiHint: "elderly man"  },
  { id: 3, name: "ইমাম ফাতিমা খাতুন (মহিলা)", mosque: "মোহাম্মদপুর এলাকা (মহিলাদের জন্য বিশেষ সহায়তা), ঢাকা", phone: "01900-000003", expertise: "মহিলাদের মৃতদেহ প্রস্তুতি, পরিবারকে মানসিক সহায়তা, মহিলাদের জন্য দোয়া", image: "https://placehold.co/300x200.png", dataAiHint: "woman portrait"  },
];

const additionalServices = [
  { 
    name: "কাফন সেট (দাফনের কাপড়)", 
    description: "পুরুষ ও মহিলাদের জন্য ইসলামিক নির্দেশিকা অনুসারে সম্পূর্ণ কাফনের সেট। বিভিন্ন আকার ও উন্নত মানের কাপড়ে উপলব্ধ।",
    icon: <Package className="h-8 w-8 text-primary" />
  },
  { 
    name: "অ্যাম্বুলেন্স পরিষেবা", 
    description: "মরদেহ বাসা, হাসপাতাল থেকে মসজিদ বা কবরস্থানে পরিবহনের জন্য শীতাতপ নিয়ন্ত্রিত এবং সাধারণ অ্যাম্বুলেন্স পরিষেবা। সম্মানজনক পরিবহনের জন্য বিশেষভাবে সজ্জিত।",
    icon: <Ambulance className="h-8 w-8 text-primary" />
  },
  { 
    name: "দোয়েল টিম (দাফন সহায়তা)", 
    description: "দাফন প্রক্রিয়ায় সার্বিক সহায়তার জন্য অভিজ্ঞ ও প্রশিক্ষিত দোয়েল টিম। কবর খোঁড়া, মরদেহ বহন এবং কবরস্থানে চূড়ান্ত আচার-অনুষ্ঠানে সহায়তা প্রদান।",
    icon: <UsersRound className="h-8 w-8 text-primary" />
  },
  { 
    name: "দোয়া-মাহফিল ও কুলখানি আয়োজন", 
    description: "মৃতের আত্মার মাগফেরাত কামনায় দোয়া-মাহফিল এবং কুলখানির আয়োজন। ইমাম ও কারী পরিষেবা, স্থানের ব্যবস্থা এবং প্রয়োজনীয় সরঞ্জাম সরবরাহ।",
    icon: <BookOpenText className="h-8 w-8 text-primary" />
  },
  { 
    name: "আত্মীয় ও পরিচিতদের আমন্ত্রণ", 
    description: "এসএমএস, হোয়াটসঅ্যাপ বা ইমেলের মাধ্যমে আত্মীয়স্বজন এবং বন্ধুদের জানাজা, দাফন এবং দোয়া-মাহফিলের সময় ও স্থান সম্পর্কে জানানোর জন্য সহায়তা।",
    icon: <MailPlus className="h-8 w-8 text-primary" />
  },
];

export default function ServicesPage() {
  return (
    <div className="container mx-auto py-12 px-4 md:px-6">
      <section className="mb-16">
        <div className="text-center mb-12">
          <Landmark className="h-16 w-16 mx-auto text-primary mb-4" />
          <h1 className="text-4xl font-headline font-bold text-foreground">ইমাম ও ধর্মীয় ব্যক্তিত্ব খুঁজুন</h1>
          <p className="text-muted-foreground mt-3 md:text-xl max-w-2xl mx-auto">
            জানাজার নামাজ পরিচালনা, ধর্মীয় পরামর্শ এবং অন্যান্য ধর্মীয় আচার-অনুষ্ঠানের জন্য অভিজ্ঞ ইমাম ও ধর্মীয় ব্যক্তিত্বদের সাথে সংযোগ স্থাপন করুন।
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {mockImams.map(imam => (
            <Card key={imam.id} className="flex flex-col shadow-xl hover:shadow-2xl transition-shadow duration-300 rounded-xl overflow-hidden bg-card">
              <div className="relative w-full h-56">
                <Image 
                  src={imam.image} 
                  alt={imam.name} 
                  data-ai-hint={imam.dataAiHint} 
                  layout="fill" 
                  objectFit="cover" 
                  className="rounded-t-xl"
                />
              </div>
              <CardHeader className="pt-6">
                <CardTitle className="font-headline text-2xl text-primary">{imam.name}</CardTitle>
                <CardDescription className="text-sm text-muted-foreground pt-1">{imam.mosque}</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow flex flex-col">
                <p className="text-sm text-foreground mb-4 flex-grow"><strong>বিশেষত্ব:</strong> {imam.expertise}</p>
                <a href={`tel:${imam.phone}`} className="mt-auto block">
                  <Button variant="outline" className="w-full border-primary text-primary hover:bg-primary/10 hover:text-primary font-semibold py-3">
                    <Phone className="mr-2 h-5 w-5" /> এখনই কল করুন ({imam.phone})
                  </Button>
                </a>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section id="additional-services" className="pt-12">
        <div className="text-center mb-12">
          <UsersRound className="h-16 w-16 mx-auto text-accent mb-4" />
          <h1 className="text-4xl font-headline font-bold text-foreground">অতিরিক্ত অন্ত্যেষ্টিক্রিয়া পরিষেবা</h1>
          <p className="text-muted-foreground mt-3 md:text-xl max-w-2xl mx-auto">
            অন্ত্যেষ্টিক্রিয়া ব্যবস্থাপনার প্রতিটি ধাপে আপনাকে সহায়তা করার জন্য আমরা বিভিন্ন ধরনের সহায়ক পরিষেবা প্রদান করি।
          </p>
        </div>
        <Accordion type="single" collapsible className="w-full max-w-3xl mx-auto bg-background rounded-lg shadow-lg">
          {additionalServices.map((service, index) => (
            <AccordionItem value={`item-${index}`} key={service.name} className={cn(index === additionalServices.length - 1 ? "border-b-0" : "")}>
              <AccordionTrigger className="text-lg font-semibold hover:no-underline py-5 px-6 rounded-t-lg hover:bg-muted/50 transition-colors data-[state=open]:bg-muted/50 data-[state=open]:rounded-b-none">
                <div className="flex items-center space-x-3">
                  {React.cloneElement(service.icon, { className: "h-7 w-7 text-primary" })}
                  <span>{service.name}</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-6 pt-2 border-t">
                <p className="text-muted-foreground mb-6">{service.description}</p>
                <ContactServiceForm serviceName={service.name} />
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>
    </div>
  );
}

    