
'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Users, HeartHandshake, Sparkles, PenSquare, MessageSquare, FileSignature, Send, LifeBuoy, HelpingHand, Workflow, ClipboardList, Brain, SearchCheck, ShieldCheck, Quote, UserPlus, Loader2, AlertTriangle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import * as React from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from "@/hooks/use-toast";
import { Separator } from "@/components/ui/separator";

interface TestimonialEntry {
  id: string;
  name: string;
  quote: string;
  image?: string; // Data URI for the image
  aiHint?: string;
}

const testimonialSchema = z.object({
  name: z.string().min(1, 'আপনার নাম আবশ্যক'),
  quote: z.string().min(30, 'আপনার মতামত কমপক্ষে ৩০ অক্ষরের হতে হবে'),
  image: z.string().optional(),
});

type TestimonialFormValues = z.infer<typeof testimonialSchema>;

const defaultTestimonials: TestimonialEntry[] = [
  {
    id: 'default-1',
    quote: "এই অ্যাপটি ব্যবহার করে খুব সহজেই জানাজার সময় এবং অন্যান্য তথ্য পেয়েছি। এমন কঠিন সময়ে এই সাহায্যটুকু অনেক বড়।",
    name: "একজন ব্যবহারকারী",
    image: "https://placehold.co/100x100.png",
    aiHint: "person avatar"
  },
  {
    id: 'default-2',
    quote: "এআই দিয়ে স্মরণিকা তৈরির ফিচারটা অসাধারণ। আমার বাবার জীবনের কথাগুলো সুন্দরভাবে সাজাতে পেরেছি।",
    name: "আরেকজন ব্যবহারকারী",
    image: "https://placehold.co/100x100.png",
    aiHint: "person avatar"
  },
  {
    id: 'default-3',
    quote: "সেবক (এআই চ্যাট) অনেক সহানুভূতি নিয়ে আমার প্রশ্নের উত্তর দিয়েছে। মনে হয়েছে কেউ সত্যিই পাশে আছে।",
    name: "একজন কৃতজ্ঞ ব্যবহারকারী",
    image: "https://placehold.co/100x100.png",
    aiHint: "person avatar"
  }
];

export default function Home() {
  const services = [
    {
      title: "মৃত্যুর প্রতিবেদন ও জানাজার সময়",
      description: "অপরিহার্য বিবরণ জমা দিন এবং ইসলামিক ঐতিহ্য ও স্থানীয় সময়সূচীর উপর ভিত্তি করে জানাজার জন্য এআই-চালিত সময়ের প্রস্তাবনা পান।",
      icon: <FileText className="h-10 w-10 text-primary mb-4" />,
      link: "/report-death",
      cta: "প্রতিবেদন করুন ও সময় জানুন"
    },
    {
      title: "এআই স্মরণিকা জেনারেটর",
      description: "প্রিয়জনের জীবনের উল্লেখযোগ্য ঘটনা ও স্মৃতির উপর ভিত্তি করে একটি সহানুভূতিপূর্ণ স্মরণিকা তৈরি করুন। ঐচ্ছিকভাবে স্মৃতিচিহ্নস্বরূপ ছবিও তৈরি করতে পারবেন।",
      icon: <PenSquare className="h-10 w-10 text-primary mb-4" />,
      link: "/generate-obituary",
      cta: "স্মরণিকা তৈরি করুন"
    },
    {
      title: "আগাম পরিকল্পনা করুন",
      description: "আপনার অন্তিম ইচ্ছেগুলো নথিভুক্ত করে প্রিয়জনদের জন্য এই কঠিন সময়কে কিছুটা সহজ করুন।",
      icon: <FileSignature className="h-10 w-10 text-primary mb-4" />,
      link: "/plan-ahead",
      cta: "পরিকল্পনা করুন"
    },
     {
      title: "আমন্ত্রণ সহায়তা",
      description: "এআই এর সাহায্যে জানাজা, দোয়া মাহফিল ও অন্যান্য অনুষ্ঠানের জন্য আমন্ত্রণ বার্তা তৈরি করুন এবং সহজে শেয়ার করুন।",
      icon: <Send className="h-10 w-10 text-primary mb-4" />,
      link: "/invitations",
      cta: "আমন্ত্রণ তৈরি করুন"
    },
    {
      title: "এআই চ্যাট সহকারী",
      description: "অ্যাপের বৈশিষ্ট্য, অন্ত্যেষ্টিক্রিয়া পদ্ধতি বা সাধারণ সহায়তার জন্য আমাদের এআই সহকারীর সাথে কথা বলুন।",
      icon: <MessageSquare className="h-10 w-10 text-primary mb-4" />,
      link: "/chat",
      cta: "চ্যাট শুরু করুন"
    },
    {
      title: "পরিষেবা প্রদানকারী খুঁজুন",
      description: "জানাজার অনুষ্ঠানের জন্য স্থানীয় ইমাম এবং অন্যান্য অপরিহার্য পরিষেবা প্রদানকারীদের সাথে সংযোগ স্থাপন করুন। ইমামগণ ছবিসহ তাদের প্রোফাইল তৈরি করতে পারেন।",
      icon: <Users className="h-10 w-10 text-primary mb-4" />,
      link: "/services",
      cta: "প্রদানকারী খুঁজুন"
    },
    {
      title: "শোক ও সান্ত্বনা",
      description: "প্রিয়জন হারানোর কঠিন সময়ে মানসিক সমর্থন এবং শোক মোকাবিলার জন্য প্রয়োজনীয় তথ্য ও সহায়তা পান।",
      icon: <LifeBuoy className="h-10 w-10 text-primary mb-4" />,
      link: "/grief-support",
      cta: "সমর্থন পান"
    },
    {
      title: "অতিরিক্ত সহায়তা পরিষেবা",
      description: "কাফন সেট, অ্যাম্বুলেন্স, দোয়েল টিম, দোয়া-মাহফিল এবং পারিবারিক আমন্ত্রণের মতো পরিষেবাগুলি অ্যাক্সেস করুন।",
      icon: <HeartHandshake className="h-10 w-10 text-primary mb-4" />,
      link: "/services#additional-services",
      cta: "পরিষেবাগুলি দেখুন"
    },
  ];

  const howItWorksSteps = [
    {
      title: "তথ্য প্রদান করুন",
      description: "মৃত্যুর বিবরণ, স্মরণিকার তথ্য বা আপনার অন্তিম পরিকল্পনা আমাদের জানান।",
      icon: <ClipboardList className="h-12 w-12 text-primary mb-4" />
    },
    {
      title: "এআই সহায়তা নিন",
      description: "জানাজার সঠিক সময়, মর্মস্পর্শী স্মরণিকার খসড়া এবং অন্যান্য গুরুত্বপূর্ণ বিষয়ে বুদ্ধিমান পরামর্শ ও সহায়তা পান।",
      icon: <Brain className="h-12 w-12 text-primary mb-4" />
    },
    {
      title: "পরিষেবা খুঁজুন",
      description: "আপনার প্রয়োজনীয় সেবাদাতা যেমন - ইমাম, অ্যাম্বুলেন্স, কাফনের কাপড় সরবরাহকারী ইত্যাদির সাথে সহজেই সংযুক্ত হোন।",
      icon: <SearchCheck className="h-12 w-12 text-primary mb-4" />
    }
  ];

  const [loadingTestimonial, setLoadingTestimonial] = React.useState(false);
  const [testimonialError, setTestimonialError] = React.useState<string | null>(null);
  const [imagePreview, setImagePreview] = React.useState<string | null>(null);
  const [userTestimonials, setUserTestimonials] = React.useState<TestimonialEntry[]>([]);
  const { toast } = useToast();

  const {
    register: registerTestimonial,
    handleSubmit: handleSubmitTestimonial,
    setValue: setValueTestimonial,
    formState: { errors: testimonialFormErrors },
    reset: resetTestimonialForm,
  } = useForm<TestimonialFormValues>({
    resolver: zodResolver(testimonialSchema),
  });

  React.useEffect(() => {
    const storedTestimonialsString = localStorage.getItem('userTestimonials');
    if (storedTestimonialsString) {
      try {
        const loadedTestimonials: TestimonialEntry[] = JSON.parse(storedTestimonialsString);
        setUserTestimonials(loadedTestimonials.reverse()); 
      } catch (error) {
        console.error("Failed to parse testimonials from local storage:", error);
        setUserTestimonials([]);
      }
    }
  }, []);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) { 
        toast({
          title: "ফাইলের আকার বড়",
          description: "অনুগ্রহ করে ২MB এর চেয়ে ছোট ছবি আপলোড করুন।",
          variant: "destructive",
        });
        event.target.value = ''; 
        setImagePreview(null);
        setValueTestimonial('image', undefined);
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        const dataUri = reader.result as string;
        setImagePreview(dataUri);
        setValueTestimonial('image', dataUri); 
      };
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
      setValueTestimonial('image', undefined);
    }
  };

  const onTestimonialSubmit: SubmitHandler<TestimonialFormValues> = async (data) => {
    setLoadingTestimonial(true);
    setTestimonialError(null);

    try {
      const newTestimonial: TestimonialEntry = {
        id: crypto.randomUUID(),
        name: data.name,
        quote: data.quote,
        image: data.image,
        aiHint: data.image ? "user uploaded avatar" : "person avatar"
      };

      const existingTestimonialsString = localStorage.getItem('userTestimonials');
      const existingTestimonials: TestimonialEntry[] = existingTestimonialsString ? JSON.parse(existingTestimonialsString) : [];
      
      existingTestimonials.push(newTestimonial);
      localStorage.setItem('userTestimonials', JSON.stringify(existingTestimonials));
      setUserTestimonials(prev => [newTestimonial, ...prev]);

      toast({
        title: "মতামত জমা হয়েছে",
        description: `ধন্যবাদ, ${data.name}, আপনার মূল্যবান মতামতের জন্য।`,
      });
      resetTestimonialForm();
      setImagePreview(null);
    } catch (e) {
      console.error(e);
      const errorMessage = e instanceof Error ? e.message : 'একটি অজানা ত্রুটি ঘটেছে।';
      setTestimonialError(`মতামত জমা দিতে ব্যর্থ: ${errorMessage}`);
      toast({
        title: "ত্রুটি",
        description: `মতামত জমা দিতে ব্যর্থ: ${errorMessage}`,
        variant: "destructive",
      });
    } finally {
      setLoadingTestimonial(false);
    }
  };

  const testimonialsToDisplay = userTestimonials.length > 0 ? userTestimonials : defaultTestimonials;

  return (
    <div className="flex flex-col items-center">
      {/* Hero Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-br from-primary/10 via-background to-background">
        <div className="container px-4 md:px-6 text-center">
          <HelpingHand className="h-16 w-16 text-primary mx-auto mb-6" />
          <h1 className="text-4xl font-headline font-bold tracking-tighter sm:text-5xl md:text-6xl text-foreground">
            অন্তিম যাত্রা: কঠিন সময়ে আপনার পথপ্রদর্শক
          </h1>
          <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl mt-6 mb-8">
            বাংলাদেশে সহানুভূতিশীল এবং ব্যাপক অন্ত্যেষ্টিক্রিয়া পরিকল্পনা পরিষেবা। আমরা মর্যাদা ও সম্মানের সাথে আপনাকে সহায়তা করতে এখানে আছি। এই প্ল্যাটফর্মটি সবার জন্য সম্পূর্ণ বিনামূল্যে।
          </p>
          <Link href="/report-death">
            <Button size="lg" className="font-semibold bg-primary hover:bg-primary/90 text-primary-foreground">
              শুরু করুন
            </Button>
          </Link>
        </div>
      </section>

      {/* Services Overview Section */}
      <section className="w-full py-12 md:py-24 lg:py-20">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
            <Sparkles className="h-12 w-12 text-accent mb-2" />
            <h2 className="text-3xl font-headline font-bold tracking-tighter sm:text-4xl text-foreground">আমাদের সেবাসমূহ</h2>
            <p className="max-w-[900px] text-muted-foreground md:text-lg lg:text-base xl:text-lg">
              অন্ত্যেষ্টিক্রিয়া ব্যবস্থার প্রতিটি ধাপে সহজে এবং মানসিক শান্তির সাথে আপনাকে সাহায্য করার জন্য আমরা বিভিন্ন পরিষেবা সরবরাহ করি।
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {services.map((service) => (
              <Card key={service.title} className="flex flex-col shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-xl overflow-hidden">
                <CardHeader className="items-center text-center bg-card pt-6">
                  {service.icon}
                  <CardTitle className="font-headline text-xl">{service.title}</CardTitle>
                </CardHeader>
                <CardContent className="flex-grow text-center bg-card p-6 flex flex-col">
                  <CardDescription className="text-muted-foreground mb-6 flex-grow">{service.description}</CardDescription>
                  <Link href={service.link} className="mt-auto">
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

      {/* How It Works Section */}
      <section className="w-full py-12 md:py-24 lg:py-20 bg-secondary/30">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
            <Workflow className="h-12 w-12 text-accent mb-2" />
            <h2 className="text-3xl font-headline font-bold tracking-tighter sm:text-4xl text-foreground">সহজেই শুরু করুন</h2>
            <p className="max-w-[900px] text-muted-foreground md:text-lg">মাত্র কয়েকটি সহজ ধাপে আপনার প্রয়োজনীয় সেবা গ্রহণ করুন।</p>
          </div>
          <div className="mx-auto grid items-start gap-8 sm:max-w-5xl md:grid-cols-3 md:gap-12">
            {howItWorksSteps.map((step) => (
               <Card key={step.title} className="flex flex-col items-center text-center shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-xl overflow-hidden p-6">
                <CardHeader className="items-center p-0 mb-3">
                  {step.icon}
                  <CardTitle className="font-headline text-xl">{step.title}</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <CardDescription className="text-muted-foreground">{step.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Our Mission Section */}
      <section className="w-full py-12 md:py-24 lg:py-20 bg-background">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
            <ShieldCheck className="h-12 w-12 text-accent mb-2" />
            <h2 className="text-3xl font-headline font-bold tracking-tighter sm:text-4xl text-foreground">আমাদের লক্ষ্য</h2>
            <p className="max-w-[900px] text-muted-foreground md:text-lg text-center">
              অন্তিম যাত্রার মূল লক্ষ্য হলো এই কঠিন সময়ে আপনাদের পাশে থেকে অন্ত্যেষ্টিক্রিয়া সম্পর্কিত যাবতীয় প্রক্রিয়া সহজ ও সম্মানজনক করে তোলা। আমরা প্রযুক্তি এবং সহানুভূতির সমন্বয়ে এমন একটি প্ল্যাটফর্ম তৈরি করেছি, যেখানে আপনি প্রয়াত প্রিয়জনের স্মৃতিকে যথাযথভাবে সংরক্ষণ করতে এবং প্রয়োজনীয় সকল কার্যক্রমে স্বচ্ছতা ও স্বস্তি খুঁজে পাবেন। আমাদের এই পরিষেবাটি সম্পূর্ণ বিনামূল্যে।
            </p>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="w-full py-12 md:py-24 lg:py-20 bg-secondary/30">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
            <Quote className="h-12 w-12 text-accent mb-2" />
            <h2 className="text-3xl font-headline font-bold tracking-tighter sm:text-4xl text-foreground">ব্যবহারকারীদের কথা</h2>
            <p className="max-w-[900px] text-muted-foreground md:text-lg">আমাদের সম্পর্কে আপনার অভিজ্ঞতা জানান অথবা অন্যদের মতামত দেখুন।</p>
          </div>

          <Card className="max-w-2xl mx-auto mb-12 shadow-xl">
            <CardHeader>
              <CardTitle className="text-2xl font-headline text-center">আপনার মতামত দিন</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmitTestimonial(onTestimonialSubmit)} className="space-y-6">
                <div>
                  <Label htmlFor="testimonialName">আপনার নাম</Label>
                  <Input id="testimonialName" {...registerTestimonial('name')} placeholder="আপনার সম্পূর্ণ নাম" />
                  {testimonialFormErrors.name && <p className="text-destructive text-sm mt-1">{testimonialFormErrors.name.message}</p>}
                </div>
                <div>
                  <Label htmlFor="testimonialQuote">আপনার মতামত</Label>
                  <Textarea id="testimonialQuote" {...registerTestimonial('quote')} rows={4} placeholder="অন্তিম যাত্রা সম্পর্কে আপনার অভিজ্ঞতা লিখুন..." />
                  {testimonialFormErrors.quote && <p className="text-destructive text-sm mt-1">{testimonialFormErrors.quote.message}</p>}
                </div>
                <div>
                  <Label htmlFor="testimonialImageFile">আপনার ছবি (ঐচ্ছিক, সর্বোচ্চ ২MB)</Label>
                  <div className="flex items-center space-x-4">
                    <Input 
                      id="testimonialImageFile" 
                      type="file" 
                      accept="image/*" 
                      onChange={handleImageChange}
                      className="block w-full text-sm text-slate-500
                        file:mr-4 file:py-2 file:px-4
                        file:rounded-full file:border-0
                        file:text-sm file:font-semibold
                        file:bg-primary/10 file:text-primary
                        hover:file:bg-primary/20"
                    />
                  </div>
                  {imagePreview && (
                    <div className="mt-4 relative w-24 h-24 rounded-full overflow-hidden border shadow-sm mx-auto">
                      <Image src={imagePreview} alt="আপনার ছবির প্রিভিউ" layout="fill" objectFit="cover" data-ai-hint="user avatar preview"/>
                    </div>
                  )}
                  {testimonialFormErrors.image && <p className="text-destructive text-sm mt-1">{testimonialFormErrors.image.message}</p>}
                </div>
                <Button type="submit" disabled={loadingTestimonial} className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
                  {loadingTestimonial ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <UserPlus className="mr-2 h-4 w-4" />}
                  মতামত জমা দিন
                </Button>
                {testimonialError && (
                  <div className="mt-4 p-3 bg-destructive/10 border border-destructive/30 rounded-md text-destructive text-sm">
                    <div className="flex items-center">
                      <AlertTriangle className="h-4 w-4 mr-2 flex-shrink-0" />
                      <p>{testimonialError}</p>
                    </div>
                  </div>
                )}
              </form>
            </CardContent>
          </Card>
          
          <Separator className="my-12" />

          {testimonialsToDisplay.length > 0 ? (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {testimonialsToDisplay.map((testimonial) => (
                <Card key={testimonial.id} className="flex flex-col items-center text-center shadow-lg rounded-xl p-6 bg-card">
                   <Avatar className="h-24 w-24 mb-4 border-2 border-primary">
                    <AvatarImage src={testimonial.image || "https://placehold.co/100x100.png"} alt={testimonial.name} data-ai-hint={testimonial.aiHint || "person avatar"} />
                    <AvatarFallback>{testimonial.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <CardContent className="p-0">
                    <blockquote className="text-muted-foreground italic mb-4 text-sm">&quot;{testimonial.quote}&quot;</blockquote>
                    <p className="font-semibold text-foreground text-base">{testimonial.name}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground">এখনও কোনো ব্যবহারকারী মতামত দেননি।</p>
          )}
        </div>
      </section>
      
      {/* Informational Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-background">
        <div className="container grid items-center gap-6 px-4 md:px-6 lg:grid-cols-2 lg:gap-10">
          <div className="space-y-4">
            <h2 className="text-3xl font-headline font-bold tracking-tighter md:text-4xl/tight text-foreground">
              কঠিন সময়ে আমরা আছি আপনার পাশে
            </h2>
            <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              অন্তিম যাত্রায় আমরা গভীরভাবে উপলব্ধি করি প্রিয়জনকে হারানোর মানসিক ও বাস্তব চ্যালেঞ্জগুলো। আমাদের প্ল্যাটফর্মটি তৈরি করা হয়েছে অন্ত্যেষ্টিক্রিয়ার জটিল প্রক্রিয়াকে সহজ করার জন্য এবং এটি সবার জন্য বিনামূল্যে ব্যবহারযোগ্য। আমরা আপনাকে নির্ভরযোগ্য তথ্য, এআই-চালিত সহায়তা এবং প্রয়োজনীয় সেবাসমূহের সাথে সংযুক্ত করি, সর্বোচ্চ যত্ন ও সাংস্কৃতিক সংবেদনশীলতার সাথে।
            </p>
            <ul className="grid gap-2 py-4">
              <li>
                <HelpingHand className="mr-2 inline-block h-4 w-4 text-primary" />
                পরিষ্কার, ধাপে ধাপে নির্দেশিকা।
              </li>
              <li>
                <HelpingHand className="mr-2 inline-block h-4 w-4 text-primary" />
                যাচাইকৃত পরিষেবা প্রদানকারীদের অ্যাক্সেস।
              </li>
               <li>
                <HelpingHand className="mr-2 inline-block h-4 w-4 text-primary" />
                এআই-চালিত স্বয়ংক্রিয় পরামর্শ ও সহায়তা।
              </li>
              <li>
                <HelpingHand className="mr-2 inline-block h-4 w-4 text-primary" />
                সম্মানজনক এবং সাংস্কৃতিকভাবে উপযুক্ত সহায়তা।
              </li>
            </ul>
          </div>
          <Image
            src="https://i.ibb.co/JRVGR0t/AIRetouch-20250610-115309345.jpg"
            alt="সহায়ক চিত্র"
            data-ai-hint="custom image"
            width={600}
            height={400}
            className="mx-auto aspect-video overflow-hidden rounded-xl object-cover object-center sm:w-full lg:order-last"
          />
        </div>
      </section>
    </div>
  );
}
    

    

