
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
import { CalendarIcon, Loader2, AlertTriangle, PenSquare, Copy } from 'lucide-react';
import { generateObituary, type GenerateObituaryInput, type GenerateObituaryOutput } from '@/ai/flows/generate-obituary-flow';
import { useToast } from "@/hooks/use-toast";
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { bn } from 'date-fns/locale';
import { cn } from '@/lib/utils';

const obituarySchema = z.object({
  deceasedName: z.string().min(1, 'মৃত ব্যক্তির নাম আবশ্যক'),
  dateOfBirth: z.date().optional(),
  dateOfDeath: z.date({ required_error: "মৃত্যুর তারিখ আবশ্যক।" }),
  significantEvents: z.string().min(1, 'উল্লেখযোগ্য ঘটনা ও অর্জনসমূহ আবশ্যক'),
  personality: z.string().min(1, 'ব্যক্তিত্বের বৈশিষ্ট্য আবশ্যক'),
  survivedBy: z.string().min(1, 'পরিবারের সদস্যগণের তথ্য আবশ্যক'),
});

type ObituaryFormValues = z.infer<typeof obituarySchema>;

export default function GenerateObituaryPage() {
  const [loading, setLoading] = useState(false);
  const [generatedObituary, setGeneratedObituary] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch
  } = useForm<ObituaryFormValues>({
    resolver: zodResolver(obituarySchema),
  });

  const selectedBirthDate = watch('dateOfBirth');
  const selectedDeathDate = watch('dateOfDeath');

  const onSubmit: SubmitHandler<ObituaryFormValues> = async (data) => {
    setLoading(true);
    setError(null);
    setGeneratedObituary(null);

    try {
      const aiInput: GenerateObituaryInput = {
        deceasedName: data.deceasedName,
        dateOfBirth: data.dateOfBirth ? format(data.dateOfBirth, 'yyyy-MM-dd') : undefined,
        dateOfDeath: format(data.dateOfDeath, 'yyyy-MM-dd'),
        significantEvents: data.significantEvents,
        personality: data.personality,
        survivedBy: data.survivedBy,
      };

      const result: GenerateObituaryOutput = await generateObituary(aiInput);
      setGeneratedObituary(result.obituaryText);
      toast({
        title: "স্মরণিকা প্রস্তুত",
        description: "এআই দ্বারা স্মরণিকা তৈরি করা হয়েছে।",
      });
    } catch (e) {
      console.error(e);
      const errorMessage = e instanceof Error ? e.message : 'একটি অজানা ত্রুটি ঘটেছে।';
      setError(`স্মরণিকা তৈরি করতে ব্যর্থ: ${errorMessage}`);
      toast({
        title: "ত্রুটি",
        description: `স্মরণিকা তৈরি করতে ব্যর্থ: ${errorMessage}`,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCopyToClipboard = () => {
    if (generatedObituary) {
      navigator.clipboard.writeText(generatedObituary)
        .then(() => {
          toast({ title: "কপি করা হয়েছে", description: "স্মরণিকা ক্লিপবোর্ডে কপি করা হয়েছে।" });
        })
        .catch(err => {
          toast({ title: "কপি করতে ব্যর্থ", description: "স্মরণিকা কপি করা যায়নি।", variant: "destructive" });
          console.error('Failed to copy: ', err);
        });
    }
  };

  return (
    <div className="container mx-auto py-12 px-4 md:px-6">
      <Card className="max-w-3xl mx-auto shadow-xl">
        <CardHeader className="text-center">
          <PenSquare className="h-12 w-12 mx-auto text-primary mb-2" />
          <CardTitle className="text-3xl font-headline">এআই চালিত স্মরণিকা তৈরি করুন</CardTitle>
          <CardDescription>
            প্রিয়জনের জীবনের গল্প ও স্মৃতিগুলো সুন্দরভাবে তুলে ধরতে প্রয়োজনীয় তথ্য দিন। আমাদের এআই সিস্টেম একটি খসড়া স্মরণিকা তৈরি করতে সাহায্য করবে।
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <Label htmlFor="deceasedName">মৃত ব্যক্তির পুরো নাম</Label>
              <Input id="deceasedName" {...register('deceasedName')} />
              {errors.deceasedName && <p className="text-destructive text-sm mt-1">{errors.deceasedName.message}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="dateOfBirth">জন্ম তারিখ (ঐচ্ছিক)</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !selectedBirthDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {selectedBirthDate ? format(selectedBirthDate, "PPP", { locale: bn }) : <span>একটি তারিখ নির্বাচন করুন</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={selectedBirthDate}
                      onSelect={(date) => setValue('dateOfBirth', date || undefined)}
                      captionLayout="dropdown-buttons"
                      fromYear={1900}
                      toYear={new Date().getFullYear()}
                      locale={bn}
                    />
                  </PopoverContent>
                </Popover>
                {errors.dateOfBirth && <p className="text-destructive text-sm mt-1">{errors.dateOfBirth.message}</p>}
              </div>
              <div>
                <Label htmlFor="dateOfDeath">মৃত্যুর তারিখ</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !selectedDeathDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {selectedDeathDate ? format(selectedDeathDate, "PPP", { locale: bn }) : <span>একটি তারিখ নির্বাচন করুন</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={selectedDeathDate}
                      onSelect={(date) => setValue('dateOfDeath', date || new Date())}
                      initialFocus
                      locale={bn}
                      captionLayout="dropdown-buttons"
                      fromYear={1900}
                      toYear={new Date().getFullYear()}
                    />
                  </PopoverContent>
                </Popover>
                {errors.dateOfDeath && <p className="text-destructive text-sm mt-1">{errors.dateOfDeath.message}</p>}
              </div>
            </div>
            
            <div>
              <Label htmlFor="significantEvents">জীবনের উল্লেখযোগ্য ঘটনা ও অর্জনসমূহ</Label>
              <Textarea id="significantEvents" {...register('significantEvents')} rows={4} placeholder="যেমন: শিক্ষাগত যোগ্যতা, কর্মজীবন, সামাজিক কর্মকাণ্ড, বিশেষ শখ ইত্যাদি।"/>
              {errors.significantEvents && <p className="text-destructive text-sm mt-1">{errors.significantEvents.message}</p>}
            </div>

            <div>
              <Label htmlFor="personality">ব্যক্তিত্বের প্রধান বৈশিষ্ট্যসমূহ</Label>
              <Textarea id="personality" {...register('personality')} rows={3} placeholder="যেমন: দয়ালু, পরোপকারী, হাস্যোজ্জ্বল, দৃঢ়চেতা ইত্যাদি।"/>
              {errors.personality && <p className="text-destructive text-sm mt-1">{errors.personality.message}</p>}
            </div>

            <div>
              <Label htmlFor="survivedBy">পরিবারে যারা আছেন</Label>
              <Input id="survivedBy" {...register('survivedBy')} placeholder="যেমন: স্ত্রী/স্বামী, পুত্র, কন্যা, নাতি-নাতনি, ভাই-বোন ইত্যাদি।"/>
              {errors.survivedBy && <p className="text-destructive text-sm mt-1">{errors.survivedBy.message}</p>}
            </div>

            <Button type="submit" disabled={loading} className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
              {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <PenSquare className="mr-2 h-4 w-4" />}
              স্মরণিকা তৈরি করুন
            </Button>
          </form>

          {error && (
            <div className="mt-6 p-4 bg-destructive/10 border border-destructive/30 rounded-md text-destructive">
              <div className="flex items-center">
                <AlertTriangle className="h-5 w-5 mr-2" />
                <p className="font-medium">ত্রুটি</p>
              </div>
              <p className="text-sm">{error}</p>
            </div>
          )}

          {generatedObituary && (
            <Card className="mt-8 shadow-md border-accent">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-2xl font-headline text-accent flex items-center">
                  <PenSquare className="mr-2 h-6 w-6" /> তৈরি করা স্মরণিকা
                </CardTitle>
                <Button variant="outline" size="icon" onClick={handleCopyToClipboard} aria-label="স্মরণিকা কপি করুন">
                  <Copy className="h-5 w-5" />
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground whitespace-pre-wrap">{generatedObituary}</p>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
