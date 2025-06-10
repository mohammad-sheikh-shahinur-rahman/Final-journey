
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Users, CalendarClock, HeartHandshake, Sparkles, Feather, PenSquare, MessageSquare, FileSignature, Send } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

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
      description: "প্রিয়জনের জীবনের উল্লেখযোগ্য ঘটনা ও স্মৃতির উপর ভিত্তি করে একটি সহানুভূতিপূর্ণ স্মরণিকা তৈরি করুন।",
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
      description: "জানাজার অনুষ্ঠানের জন্য স্থানীয় ইমাম এবং অন্যান্য অপরিহার্য পরিষেবা প্রদানকারীদের সাথে সংযোগ স্থাপন করুন।",
      icon: <Users className="h-10 w-10 text-primary mb-4" />,
      link: "/services",
      cta: "প্রদানকারী খুঁজুন"
    },
    {
      title: "অতিরিক্ত সহায়তা পরিষেবা",
      description: "কাফন সেট, অ্যাম্বুলেন্স, দোয়েল টিম, দোয়া-মাহফিল এবং পারিবারিক আমন্ত্রণের মতো পরিষেবাগুলি অ্যাক্সেস করুন।",
      icon: <HeartHandshake className="h-10 w-10 text-primary mb-4" />,
      link: "/services#additional-services",
      cta: "পরিষেবাগুলি দেখুন"
    },
  ];

  return (
    <div className="flex flex-col items-center">
      {/* Hero Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-br from-primary/10 via-background to-background">
        <div className="container px-4 md:px-6 text-center">
          <Feather className="h-16 w-16 text-primary mx-auto mb-6" />
          <h1 className="text-4xl font-headline font-bold tracking-tighter sm:text-5xl md:text-6xl text-foreground">
            সেবাপ্ল্যান: কঠিন সময়ে আপনার পথপ্রদর্শক
          </h1>
          <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl mt-6 mb-8">
            বাংলাদেশে সহানুভূতিশীল এবং ব্যাপক অন্ত্যেষ্টিক্রিয়া পরিকল্পনা পরিষেবা। আমরা মর্যাদা ও সম্মানের সাথে আপনাকে সহায়তা করতে এখানে আছি।
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
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
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
      
      {/* Informational Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-secondary/50">
        <div className="container grid items-center gap-6 px-4 md:px-6 lg:grid-cols-2 lg:gap-10">
          <div className="space-y-4">
            <h2 className="text-3xl font-headline font-bold tracking-tighter md:text-4xl/tight text-foreground">
              যখন আপনার সবচেয়ে বেশি প্রয়োজন তখন সমর্থন এবং নির্দেশিকা
            </h2>
            <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              সেবাপ্ল্যানে, আমরা প্রিয়জনকে হারানোর সাথে আসা মানসিক এবং লজিস্টিক চ্যালেঞ্জগুলি বুঝি। আমাদের প্ল্যাটফর্মটি অন্ত্যেষ্টিক্রিয়া পরিকল্পনা প্রক্রিয়া সহজ করার জন্য ডিজাইন করা হয়েছে, আপনাকে নির্ভরযোগ্য তথ্য সরবরাহ করে এবং প্রয়োজনীয় পরিষেবাগুলির সাথে সংযুক্ত করে, সমস্তই অত্যন্ত যত্ন এবং সাংস্কৃতিক সংবেদনশীলতার সাথে।
            </p>
            <ul className="grid gap-2 py-4">
              <li>
                <Feather className="mr-2 inline-block h-4 w-4 text-primary" />
                পরিষ্কার, ধাপে ধাপে নির্দেশিকা।
              </li>
              <li>
                <Feather className="mr-2 inline-block h-4 w-4 text-primary" />
                যাচাইকৃত পরিষেবা প্রদানকারীদের অ্যাক্সেস।
              </li>
              <li>
                <Feather className="mr-2 inline-block h-4 w-4 text-primary" />
                সম্মানজনক এবং সাংস্কৃতিকভাবে উপযুক্ত সহায়তা।
              </li>
            </ul>
          </div>
          <Image
            src="https://i.ibb.co/JRVGR0tL/AIRetouch-20250610-115309345.jpg"
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
    
