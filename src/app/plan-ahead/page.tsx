
'use client';

import { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileSignature, Printer, AlertTriangle } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { Separator } from '@/components/ui/separator';

const planAheadSchema = z.object({
  fullName: z.string().min(1, 'পুরো নাম আবশ্যক'),
  preferredBurialLocation: z.string().optional(),
  preferredImam: z.string().optional(),
  ghuslKafanInstructions: z.string().optional(),
  janazaDafinRequests: z.string().optional(),
  whomToNotify: z.string().optional(),
  otherWishes: z.string().optional(),
});

type PlanAheadFormValues = z.infer<typeof planAheadSchema>;

interface FormattedPlan {
  title: string;
  details: Array<{ label: string; value?: string }>;
}

export default function PlanAheadPage() {
  const [formattedPlan, setFormattedPlan] = useState<FormattedPlan | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<PlanAheadFormValues>({
    resolver: zodResolver(planAheadSchema),
  });

  const onSubmit: SubmitHandler<PlanAheadFormValues> = (data) => {
    setError(null);
    try {
      const plan: FormattedPlan = {
        title: `"${data.fullName}" এর জন্য অন্ত্যেষ্টিক্রিয়া পরিকল্পনা`,
        details: [
          { label: 'পুরো নাম', value: data.fullName },
          { label: 'পছন্দের কবরস্থান', value: data.preferredBurialLocation },
          { label: 'পছন্দের ইমাম', value: data.preferredImam },
          { label: 'গোসল ও কাফন সংক্রান্ত বিশেষ নির্দেশনা', value: data.ghuslKafanInstructions },
          { label: 'জানাজা ও দাফন সম্পর্কে বিশেষ অনুরোধ', value: data.janazaDafinRequests },
          { label: 'যাদেরকে জানাতে হবে', value: data.whomToNotify },
          { label: 'অন্যান্য বিশেষ ইচ্ছা', value: data.otherWishes },
        ].filter(item => item.value && item.value.trim() !== ''), // Filter out empty optional fields
      };
      setFormattedPlan(plan);
      toast({
        title: "পরিকল্পনা প্রস্তুত",
        description: "আপনার অন্ত্যেষ্টিক্রিয়ার পরিকল্পনা তৈরি করা হয়েছে এবং নিচে দেখানো হচ্ছে।",
      });
      reset(); // Reset form after successful submission
    } catch (e) {
      console.error(e);
      const errorMessage = e instanceof Error ? e.message : 'একটি অজানা ত্রুটি ঘটেছে।';
      setError(`পরিকল্পনা তৈরি করতে ব্যর্থ: ${errorMessage}`);
      toast({
        title: "ত্রুটি",
        description: `পরিকল্পনা তৈরি করতে ব্যর্থ: ${errorMessage}`,
        variant: "destructive",
      });
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="container mx-auto py-12 px-4 md:px-6">
      <Card className="max-w-3xl mx-auto shadow-xl">
        <CardHeader className="text-center">
          <FileSignature className="h-12 w-12 mx-auto text-primary mb-2" />
          <CardTitle className="text-3xl font-headline">আপনার শেষযাত্রার পরিকল্পনা করুন</CardTitle>
          <CardDescription>
            আপনার অন্তিম ইচ্ছেগুলো নথিভুক্ত করে আপনার প্রিয়জনদের জন্য এই কঠিন সময়কে কিছুটা সহজ করুন। পূরণকৃত তথ্যসমূহ শুধুমাত্র আপনার ডিভাইসে প্রদর্শিত হবে এবং কোথাও স্থায়ীভাবে সংরক্ষণ করা হবে না।
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!formattedPlan ? (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div>
                <Label htmlFor="fullName">আপনার পুরো নাম</Label>
                <Input id="fullName" {...register('fullName')} placeholder="এখানে আপনার নাম লিখুন" />
                {errors.fullName && <p className="text-destructive text-sm mt-1">{errors.fullName.message}</p>}
              </div>

              <div>
                <Label htmlFor="preferredBurialLocation">পছন্দের কবরস্থান (ঐচ্ছিক)</Label>
                <Input id="preferredBurialLocation" {...register('preferredBurialLocation')} placeholder="কবরস্থানের নাম ও ঠিকানা" />
              </div>

              <div>
                <Label htmlFor="preferredImam">পছন্দের ইমাম (যদি থাকে, ঐচ্ছিক)</Label>
                <Input id="preferredImam" {...register('preferredImam')} placeholder="ইমামের নাম ও যোগাযোগের তথ্য" />
              </div>

              <div>
                <Label htmlFor="ghuslKafanInstructions">গোসল ও কাফন সংক্রান্ত বিশেষ নির্দেশনা (ঐচ্ছিক)</Label>
                <Textarea id="ghuslKafanInstructions" {...register('ghuslKafanInstructions')} rows={3} placeholder="বিশেষ কোনো অনুরোধ থাকলে লিখুন"/>
              </div>

              <div>
                <Label htmlFor="janazaDafinRequests">জানাজা ও দাফন সম্পর্কে বিশেষ অনুরোধ (ঐচ্ছিক)</Label>
                <Textarea id="janazaDafinRequests" {...register('janazaDafinRequests')} rows={3} placeholder="যেমন: জানাজার স্থান, সময় ইত্যাদি" />
              </div>
              
              <div>
                <Label htmlFor="whomToNotify">যাদেরকে জানাতে হবে (নাম, সম্পর্ক, ফোন নম্বর - ঐচ্ছিক)</Label>
                <Textarea id="whomToNotify" {...register('whomToNotify')} rows={4} placeholder="যেমন: \nকবির আহমেদ - ভাই - ০১xxxxxxxxx\nফাতিমা বেগম - কন্যা - ০১xxxxxxxxx" />
              </div>

              <div>
                <Label htmlFor="otherWishes">অন্যান্য বিশেষ ইচ্ছা (ঐচ্ছিক)</Label>
                <Textarea id="otherWishes" {...register('otherWishes')} rows={3} placeholder="অন্য কোনো অনুরোধ বা নির্দেশনা থাকলে লিখুন"/>
              </div>

              <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
                <FileSignature className="mr-2 h-4 w-4" />
                পরিকল্পনা তৈরি করুন
              </Button>
            </form>
          ) : (
            <div className="space-y-6">
              <Card className="shadow-md border-accent" id="plan-summary">
                <CardHeader>
                  <CardTitle className="text-2xl font-headline text-accent flex items-center justify-between">
                    <span>{formattedPlan.title}</span>
                    <Button variant="outline" size="icon" onClick={handlePrint} aria-label="পরিকল্পনা প্রিন্ট করুন">
                      <Printer className="h-5 w-5" />
                    </Button>
                  </CardTitle>
                  <CardDescription>এই পরিকল্পনাটি আপনার দেওয়া তথ্যের উপর ভিত্তি করে তৈরি করা হয়েছে। অনুগ্রহ করে এটি প্রিন্ট করে একটি নিরাপদ স্থানে রাখুন।</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {formattedPlan.details.map((item, index) => (
                    item.value && (
                      <div key={index}>
                        <h4 className="font-semibold text-foreground">{item.label}:</h4>
                        <p className="text-muted-foreground whitespace-pre-wrap">{item.value}</p>
                        {index < formattedPlan.details.length - 1 && <Separator className="my-3" />}
                      </div>
                    )
                  ))}
                </CardContent>
              </Card>
              <Button onClick={() => setFormattedPlan(null)} variant="outline" className="w-full">
                নতুন পরিকল্পনা তৈরি করুন
              </Button>
            </div>
          )}

          {error && (
            <div className="mt-6 p-4 bg-destructive/10 border border-destructive/30 rounded-md text-destructive">
              <div className="flex items-center">
                <AlertTriangle className="h-5 w-5 mr-2" />
                <p className="font-medium">ত্রুটি</p>
              </div>
              <p className="text-sm">{error}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
