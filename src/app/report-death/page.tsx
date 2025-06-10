
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
import { CalendarIcon, ClockIcon, FileText, Brain, Loader2, AlertTriangle } from 'lucide-react';
import { suggestJanazaTime, type SuggestJanazaTimeInput, type SuggestJanazaTimeOutput } from '@/ai/flows/suggest-janaza-time';
import { useToast } from "@/hooks/use-toast";
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { bn } from 'date-fns/locale';
import { cn } from '@/lib/utils';

const deathReportSchema = z.object({
  deceasedName: z.string().min(1, 'মৃত ব্যক্তির নাম আবশ্যক'),
  address: z.string().min(1, 'ঠিকানা আবশ্যক'),
  timeOfDeathDate: z.date({ required_error: "মৃত্যুর তারিখ আবশ্যক।" }),
  timeOfDeathTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "অবৈধ সময় বিন্যাস (HH:MM)। অনুগ্রহ করে HH:MM ফরম্যাটে লিখুন, যেমন: ১৪:৩০।"),
  contactPersonName: z.string().min(1, 'যোগাযোগকারী ব্যক্তির নাম আবশ্যক'),
  contactPersonPhone: z.string().min(1, 'যোগাযোগকারী ব্যক্তির ফোন আবশ্যক'),
  contactPersonEmail: z.string().email('অবৈধ ইমেল ঠিকানা').optional().or(z.literal('')),
  localMasjidSchedule: z.string().min(1, 'স্থানীয় মসজিদের নামাজের সময়সূচী আবশ্যক।'),
  location: z.string().min(1, 'সাধারণ অবস্থান (শহর/এলাকা) আবশ্যক।'),
});

type DeathReportFormValues = z.infer<typeof deathReportSchema>;

export default function ReportDeathPage() {
  const [loading, setLoading] = useState(false);
  const [janazaSuggestions, setJanazaSuggestions] = useState<SuggestJanazaTimeOutput | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch
  } = useForm<DeathReportFormValues>({
    resolver: zodResolver(deathReportSchema),
  });

  const selectedDate = watch('timeOfDeathDate');

  const onSubmit: SubmitHandler<DeathReportFormValues> = async (data) => {
    setLoading(true);
    setError(null);
    setJanazaSuggestions(null);

    try {
      // Combine date and time, then format to ISO string with timezone offset
      // Assuming the user inputs time in local (Bangladesh) time.
      // Bangladesh Standard Time (BST) is UTC+6.
      const localDateTime = new Date(`${format(data.timeOfDeathDate, 'yyyy-MM-dd')}T${data.timeOfDeathTime}:00`);
      
      // Create a new Date object for UTC, then manually adjust to BST
      // This is a bit of a workaround because JS Date objects can be tricky with timezones
      const year = localDateTime.getFullYear();
      const month = localDateTime.getMonth();
      const day = localDateTime.getDate();
      const hours = localDateTime.getHours();
      const minutes = localDateTime.getMinutes();

      // Construct date in a way that when toISOString() is called, it reflects the intended local time if the server interprets it as UTC.
      // For robust timezone handling, a library like date-fns-tz is better, but for simplicity:
      // We format it as ISO and append +06:00 for BST.
      const timeOfDeathISO = `${format(data.timeOfDeathDate, 'yyyy-MM-dd')}T${data.timeOfDeathTime}:00+06:00`;
      
      const aiInput: SuggestJanazaTimeInput = {
        timeOfDeath: timeOfDeathISO,
        localMasjidSchedule: data.localMasjidSchedule,
        location: data.location,
      };

      const result = await suggestJanazaTime(aiInput);
      setJanazaSuggestions(result);
      toast({
        title: "প্রস্তাবনা প্রস্তুত",
        description: "জানাজার সময়ের এআই প্রস্তাবনা তৈরি করা হয়েছে।",
      });
    } catch (e) {
      console.error(e);
      const errorMessage = e instanceof Error ? e.message : 'একটি অজানা ত্রুটি ঘটেছে।';
      setError(`জানাজার সময়ের প্রস্তাবনা পেতে ব্যর্থ: ${errorMessage}`);
      toast({
        title: "ত্রুটি",
        description: `প্রস্তাবনা পেতে ব্যর্থ: ${errorMessage}`,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-12 px-4 md:px-6">
      <Card className="max-w-2xl mx-auto shadow-xl">
        <CardHeader className="text-center">
          <FileText className="h-12 w-12 mx-auto text-primary mb-2" />
          <CardTitle className="text-3xl font-headline">মৃত্যুর প্রতিবেদন করুন ও জানাজার সময় জানুন</CardTitle>
          <CardDescription>
            অনুগ্রহ করে প্রয়োজনীয় বিবরণ সরবরাহ করুন। এর মাধ্যমে আপনি একইসাথে মৃত্যুর প্রতিবেদন জমা দিতে এবং জানাজার সময়ের জন্য এআই প্রস্তাবনা পেতে পারবেন।
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <Label htmlFor="deceasedName">মৃত ব্যক্তির পুরো নাম</Label>
              <Input id="deceasedName" {...register('deceasedName')} placeholder="এখানে মৃত ব্যক্তির নাম লিখুন" />
              {errors.deceasedName && <p className="text-destructive text-sm mt-1">{errors.deceasedName.message}</p>}
            </div>

            <div>
              <Label htmlFor="address">মৃত ব্যক্তির ঠিকানা</Label>
              <Input id="address" {...register('address')} placeholder="বাসা/গ্রাম, থানা, জেলা" />
              {errors.address && <p className="text-destructive text-sm mt-1">{errors.address.message}</p>}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="timeOfDeathDate">মৃত্যুর তারিখ</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !selectedDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {selectedDate ? format(selectedDate, "PPP", { locale: bn }) : <span>একটি তারিখ নির্বাচন করুন</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={(date) => setValue('timeOfDeathDate', date || new Date())}
                      initialFocus
                      locale={bn}
                      captionLayout="dropdown-buttons"
                      fromYear={new Date().getFullYear() -100}
                      toYear={new Date().getFullYear()}
                    />
                  </PopoverContent>
                </Popover>
                {errors.timeOfDeathDate && <p className="text-destructive text-sm mt-1">{errors.timeOfDeathDate.message}</p>}
              </div>
              <div>
                <Label htmlFor="timeOfDeathTime">মৃত্যুর সময় (HH:MM)</Label>
                <div className="relative">
                  <ClockIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input 
                    id="timeOfDeathTime" 
                    type="time" 
                    {...register('timeOfDeathTime')} 
                    className="pl-10"
                    placeholder="যেমন, ১৪:৩০"
                  />
                </div>
                {errors.timeOfDeathTime && <p className="text-destructive text-sm mt-1">{errors.timeOfDeathTime.message}</p>}
              </div>
            </div>

            <div>
              <Label htmlFor="contactPersonName">যোগাযোগকারী ব্যক্তির নাম</Label>
              <Input id="contactPersonName" {...register('contactPersonName')} placeholder="আপনার নাম" />
              {errors.contactPersonName && <p className="text-destructive text-sm mt-1">{errors.contactPersonName.message}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="contactPersonPhone">যোগাযোগকারী ব্যক্তির ফোন</Label>
                <Input id="contactPersonPhone" type="tel" {...register('contactPersonPhone')} placeholder="আপনার ফোন নম্বর"/>
                {errors.contactPersonPhone && <p className="text-destructive text-sm mt-1">{errors.contactPersonPhone.message}</p>}
              </div>
              <div>
                <Label htmlFor="contactPersonEmail">যোগাযোগকারী ব্যক্তির ইমেল (ঐচ্ছিক)</Label>
                <Input id="contactPersonEmail" type="email" {...register('contactPersonEmail')} placeholder="আপনার ইমেল আইডি"/>
                {errors.contactPersonEmail && <p className="text-destructive text-sm mt-1">{errors.contactPersonEmail.message}</p>}
              </div>
            </div>

            <div>
              <Label htmlFor="location">সাধারণ অবস্থান (শহর/এলাকা)</Label>
              <Input id="location" {...register('location')} placeholder="যেমন, ঢাকা, গুলশান"/>
              {errors.location && <p className="text-destructive text-sm mt-1">{errors.location.message}</p>}
            </div>
            
            <div>
              <Label htmlFor="localMasjidSchedule">স্থানীয় মসজিদের নামাজের সময়সূচী</Label>
              <Textarea
                id="localMasjidSchedule"
                {...register('localMasjidSchedule')}
                placeholder="যেমন: ফজর: ভোর ৫:৩০, যোহর: দুপুর ১:৩০, আসর: বিকাল ৫:০০, মাগরিব: সূর্যাস্তের সময়, ইশা: রাত ৮:৩০। সম্ভব হলে প্রতিটি নামাজের ওয়াক্ত উল্লেখ করুন।"
                rows={4}
              />
              {errors.localMasjidSchedule && <p className="text-destructive text-sm mt-1">{errors.localMasjidSchedule.message}</p>}
            </div>

            <Button type="submit" disabled={loading} className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
              {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Brain className="mr-2 h-4 w-4" />}
              জমা দিন এবং জানাজার সময়ের প্রস্তাবনা পান
            </Button>
          </form>

          {error && (
            <div className="mt-6 p-4 bg-destructive/10 border border-destructive/30 rounded-md text-destructive">
              <div className="flex items-center">
                <AlertTriangle className="h-5 w-5 mr-2 flex-shrink-0" />
                <p className="font-medium">ত্রুটি</p>
              </div>
              <p className="text-sm">{error}</p>
            </div>
          )}

          {janazaSuggestions && (
            <Card className="mt-8 shadow-md border-accent">
              <CardHeader>
                <CardTitle className="text-2xl font-headline text-accent flex items-center">
                  <CalendarIcon className="mr-3 h-7 w-7" /> এআই প্রস্তাবিত জানাজার সময়
                </CardTitle>
                <CardDescription>নিচে এআই দ্বারা প্রস্তাবিত জানাজার সময় এবং এর পেছনের কারণ উল্লেখ করা হলো। অনুগ্রহ করে স্থানীয় ইমাম ও মুরুব্বীদের সাথে আলোচনা করে চূড়ান্ত সিদ্ধান্ত নিন।</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold text-lg mb-2 text-foreground">প্রস্তাবিত সময়সমূহ:</h4>
                  <ul className="list-disc list-inside space-y-1 pl-4">
                    {janazaSuggestions.suggestedTimes.map((time, index) => (
                      <li key={index} className="text-foreground">
                        {new Date(time).toLocaleString('bn-BD', { dateStyle: 'full', timeStyle: 'short', timeZone: 'Asia/Dhaka' })}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-lg mb-2 text-foreground">প্রস্তাবনার কারণ:</h4>
                  <p className="text-muted-foreground whitespace-pre-wrap">{janazaSuggestions.reasoning}</p>
                </div>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
    