
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { LifeBuoy, MessageCircle, Users, BookOpen, ShieldCheck, Phone } from "lucide-react";
import Link from "next/link";

const griefSupportResources = [
  {
    id: "understanding-grief",
    title: "শোক কী এবং কীভাবে তা প্রকাশ পায়?",
    icon: <BookOpen className="h-6 w-6 text-primary" />,
    content: [
      "শোক হলো প্রিয়জনকে হারানোর স্বাভাবিক প্রতিক্রিয়া। এটি শারীরিক, মানসিক, সামাজিক এবং আধ্যাত্মিকভাবে প্রকাশ পেতে পারে।",
      "সাধারণত শোকের অনুভূতিগুলো হলো: দুঃখ, শূন্যতা, রাগ, অপরাধবোধ, একাকিত্ব, ভয়, উদ্বেগ এবং কখনও কখনও স্বস্তি।",
      "শারীরিক লক্ষণগুলোর মধ্যে থাকতে পারে: ক্লান্তি, ঘুমের সমস্যা, ক্ষুধামন্দা, মাথাব্যথা, বুকে চাপ অনুভব করা ইত্যাদি।",
      "প্রত্যেকের শোক প্রকাশের ধরণ ভিন্ন এবং এর কোনো নির্দিষ্ট সময়সীমা নেই।"
    ]
  },
  {
    id: "coping-strategies",
    title: "শোক মোকাবিলার কিছু কৌশল",
    icon: <LifeBuoy className="h-6 w-6 text-primary" />,
    content: [
      "নিজের অনুভূতিগুলোকে স্বীকার করুন এবং প্রকাশ করার সুযোগ দিন। কান্না পেলে কাঁদুন, কথা বলতে ইচ্ছা হলে বলুন।",
      "পরিবার, বন্ধু বা বিশ্বস্ত কারো সাথে আপনার অনুভূতি শেয়ার করুন।",
      "নিজের যত্ন নিন: নিয়মিত পুষ্টিকর খাবার খান, পর্যাপ্ত ঘুমান এবং হালকা ব্যায়াম করুন।",
      "দৈনন্দিন রুটিন বজায় রাখার চেষ্টা করুন, এটি স্থিতিশীলতা আনতে সাহায্য করতে পারে।",
      "প্রিয়জনের স্মৃতিগুলোকে সম্মান জানান। ছবি দেখতে পারেন, তার পছন্দের কাজগুলো করতে পারেন বা তার নামে দাতব্য কাজ করতে পারেন।",
      "বড় সিদ্ধান্ত নেওয়া থেকে আপাতত বিরত থাকুন, যেমন বাসস্থান পরিবর্তন বা চাকরি ছাড়া।",
      "প্রয়োজন মনে হলে পেশাদার মনোবিদের সাহায্য নিন। শোক কাটিয়ে উঠতে কাউন্সেলিং অনেক সহায়ক হতে পারে।"
    ]
  },
  {
    id: "supporting-others",
    title: "শোকাহত ব্যক্তিকে কীভাবে সমর্থন করবেন",
    icon: <Users className="h-6 w-6 text-primary" />,
    content: [
      "তাদের কথা মনোযোগ দিয়ে শুনুন, বিচার না করে বা উপদেশ না দিয়ে।",
      "তাদের অনুভূতি প্রকাশ করতে উৎসাহিত করুন, তবে জোর করবেন না।",
      "ছোট ছোট কাজে সাহায্য করুন, যেমন বাজার করা, রান্না করা বা বাচ্চাদের দেখাশোনা করা।",
      "প্রিয়জনের মৃত্যুবার্ষিকী বা বিশেষ দিনগুলোতে তাদের পাশে থাকুন।",
      "তাদেরকে আশ্বস্ত করুন যে আপনি তাদের জন্য আছেন।",
      "তাদের শোক প্রকাশের নিজস্ব প্রক্রিয়াকে সম্মান করুন।"
    ]
  }
];

const supportOrganizations = [
  {
    name: "কান পেতে রই (Kaan Pete Roi)",
    description: "একটি আত্মহত্যা প্রতিরোধ এবং মানসিক স্বাস্থ্য সহায়তা কেন্দ্র। তারা বিনামূল্যে এবং গোপনীয়ভাবে মানসিক সহায়তা প্রদান করে।",
    contact: "হেল্পলাইন: +৮৮০XXXXXXXXX (এখানে কাল্পনিক নম্বর ব্যবহৃত)",
    website: "https://www.kaanpeteroi.org (কাল্পনিক লিঙ্ক)",
    icon: <Phone className="h-5 w-5 text-accent" />
  },
  {
    name: "মনের বন্ধু (Moner Bondhu)",
    description: "মানসিক স্বাস্থ্য এবং সুস্থতা বিষয়ক একটি প্ল্যাটফর্ম। তারা কাউন্সেলিং, কর্মশালা এবং বিভিন্ন সচেতনতামূলক কার্যক্রম পরিচালনা করে।",
    contact: "অ্যাপয়েন্টমেন্টের জন্য: +৮৮০XXXXXXXXX (এখানে কাল্পনিক নম্বর ব্যবহৃত)",
    website: "https://monerbondhu.org (কাল্পনিক লিঙ্ক)",
    icon: <MessageCircle className="h-5 w-5 text-accent" />
  },
  {
    name: "বাংলাদেশ জাতীয় মানসিক স্বাস্থ্য ইনস্টিটিউট",
    description: "সরকারি প্রতিষ্ঠান যা মানসিক স্বাস্থ্যসেবা এবং গবেষণা প্রদান করে।",
    contact: "ফোন: +৮৮০XXXXXXXXX (এখানে কাল্পনিক নম্বর ব্যবহৃত)",
    website: "http://www.nimh.gov.bd (কাল্পনিক লিঙ্ক)",
    icon: <ShieldCheck className="h-5 w-5 text-accent" />
  }
];

export default function GriefSupportPage() {
  return (
    <div className="container mx-auto py-12 px-4 md:px-6">
      <header className="text-center mb-12">
        <LifeBuoy className="h-16 w-16 mx-auto text-primary mb-4" />
        <h1 className="text-4xl font-headline font-bold text-foreground">শোক ও সান্ত্বনা</h1>
        <p className="text-muted-foreground mt-3 md:text-xl max-w-3xl mx-auto">
          প্রিয়জনকে হারানোর বেদনা অত্যন্ত কঠিন। এই সময়ে প্রয়োজনীয় তথ্য, মানসিক সমর্থন এবং সান্ত্বনা খুঁজে পেতে আমরা আপনাকে সহায়তা করতে এখানে আছি।
        </p>
      </header>

      <section className="mb-16">
        <h2 className="text-3xl font-headline font-semibold text-center text-foreground mb-8">শোক সম্পর্কে জানুন</h2>
        <Accordion type="single" collapsible className="w-full max-w-3xl mx-auto bg-card shadow-lg rounded-lg">
          {griefSupportResources.map((item, index) => (
            <AccordionItem value={`item-${index}`} key={item.id} className={index === griefSupportResources.length - 1 ? "border-b-0" : ""}>
              <AccordionTrigger className="text-lg font-semibold hover:no-underline py-5 px-6 rounded-t-lg hover:bg-muted/50 transition-colors data-[state=open]:bg-muted/50 data-[state=open]:rounded-b-none">
                <div className="flex items-center space-x-3">
                  {item.icon}
                  <span>{item.title}</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-6 pt-2 border-t">
                <ul className="list-disc space-y-2 pl-5 text-muted-foreground">
                  {item.content.map((point, idx) => (
                    <li key={idx}>{point}</li>
                  ))}
                </ul>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>

      <section>
        <h2 className="text-3xl font-headline font-semibold text-center text-foreground mb-8">সহায়ক সংস্থা ও যোগাযোগ</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {supportOrganizations.map((org) => (
            <Card key={org.name} className="shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-xl overflow-hidden flex flex-col">
              <CardHeader className="items-center text-center">
                {org.icon}
                <CardTitle className="font-headline text-xl mt-2">{org.name}</CardTitle>
              </CardHeader>
              <CardContent className="flex-grow flex flex-col">
                <p className="text-muted-foreground text-sm mb-3 flex-grow">{org.description}</p>
                <p className="text-sm text-foreground mb-1">{org.contact}</p>
                {org.website && (
                  <Link href={org.website} target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline">
                    ওয়েবসাইট ভিজিট করুন
                  </Link>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
        <p className="text-center text-sm text-muted-foreground mt-8">
          অনুগ্রহ করে মনে রাখবেন, উপরে উল্লেখিত সংস্থার তথ্য শুধুমাত্র উদাহরণস্বরূপ দেওয়া হয়েছে এবং যোগাযোগের বিবরণ কাল্পনিক। প্রয়োজনে সঠিক ও হালনাগাদ তথ্যের জন্য অনুসন্ধান করুন।
        </p>
      </section>
    </div>
  );
}

