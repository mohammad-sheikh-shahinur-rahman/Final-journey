
'use client';

import { useState } from 'react';
import { useForm, type SubmitHandler, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { CalendarIcon, Loader2, AlertTriangle, PenSquare, Copy, Image as ImageIcon, Download } from 'lucide-react';
import { generateObituary, type GenerateObituaryInput, type GenerateObituaryOutput } from '@/ai/flows/generate-obituary-flow';
import { generateMemorialImage, type MemorialImageInput, type MemorialImageOutput } from '@/ai/flows/generate-memorial-image-flow';
import { useToast } from "@/hooks/use-toast";
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { bn } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';

const obituarySchema = z.object({
  deceasedName: z.string().min(1, 'মৃত ব্যক্তির নাম আবশ্যক'),
  dateOfBirth: z.date().optional(),
  dateOfDeath: z.date({ required_error: "মৃত্যুর তারিখ আবশ্যক।" }),
  significantEvents: z.string().min(1, 'উল্লেখযোগ্য ঘটনা ও অর্জনসমূহ আবশ্যক'),
  personality: z.string().min(1, 'ব্যক্তিত্বের বৈশিষ্ট্য আবশ্যক'),
  survivedBy: z.string().min(1, 'পরিবারের সদস্যগণের তথ্য আবশ্যক'),
});

type ObituaryFormValues = z.infer<typeof obituarySchema>;

const imageThemes = [
  { value: 'শান্তিপূর্ণ প্রকৃতির দৃশ্য', label: 'শান্তিপূর্ণ প্রকৃতির দৃশ্য' },
  { value: 'স্মৃতির আলো (যেমন মোমবাতি বা লণ্ঠন)', label: 'স্মৃতির আলো (মোমবাতি/লণ্ঠন)' },
  { value: 'শ্রদ্ধাঞ্জলি ফুল (যেমন সাদা লিলি বা গোলাপ)', label: 'শ্রদ্ধাঞ্জলি ফুল (সাদা লিলি/গোলাপ)' },
  { value: 'শান্ত আকাশ বা মেঘ', label: 'শান্ত আকাশ বা মেঘ' },
  { value: 'ঐতিহ্যবাহী নকশা (সূক্ষ্ম ও পরিশীলিত)', label: 'ঐতিহ্যবাহী নকশা (সূক্ষ্ম)' },
  { value: 'একটি খোলা বই এবং পালকের কলম', label: 'খোলা বই ও পালকের কলম' },
];

export default function GenerateObituaryPage() {
  const [loadingObituary, setLoadingObituary] = useState(false);
  const [loadingImage, setLoadingImage] = useState(false);
  const [generatedObituary, setGeneratedObituary] = useState<string | null>(null);
  const [generatedImageDataUri, setGeneratedImageDataUri] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedImageTheme, setSelectedImageTheme] = useState<string>(imageThemes[0].value);
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    control
  } = useForm<ObituaryFormValues>({
    resolver: zodResolver(obituarySchema),
  });

  const selectedBirthDate = watch('dateOfBirth');
  const selectedDeathDate = watch('dateOfDeath');

  const onObituarySubmit: SubmitHandler<ObituaryFormValues> = async (data) => {
    setLoadingObituary(true);
    setError(null);
    setGeneratedObituary(null);
    setGeneratedImageDataUri(null); 

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
        description: "এআই দ্বারা স্মরণিকা তৈরি করা হয়েছে। আপনি চাইলে এখন একটি স্মৃতিচিহ্নস্বরূপ ছবিও তৈরি করতে পারেন।",
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
      setLoadingObituary(false);
    }
  };

  const handleGenerateImage = async () => {
    if (!selectedImageTheme) {
      toast({ title: "থিম নির্বাচন করুন", description: "অনুগ্রহ করে ছবি তৈরির জন্য একটি থিম নির্বাচন করুন।", variant: "destructive" });
      return;
    }
    setLoadingImage(true);
    setError(null);
    setGeneratedImageDataUri(null);

    try {
      const imageInput: MemorialImageInput = { theme: selectedImageTheme };
      const result: MemorialImageOutput = await generateMemorialImage(imageInput);
      setGeneratedImageDataUri(result.imageDataUri);
      toast({
        title: "ছবি প্রস্তুত",
        description: "স্মরণিকার জন্য স্মৃতিচিহ্নস্বরূপ ছবি তৈরি করা হয়েছে।",
      });
    } catch (e) {
      console.error(e);
      const errorMessage = e instanceof Error ? e.message : 'একটি অজানা ত্রুটি ঘটেছে। ছবিটি তৈরি করতে কয়েক মুহূর্ত সময় লাগতে পারে অথবা নির্বাচিত মডেলটি এই মুহূর্তে উপলব্ধ নাও থাকতে পারে। অনুগ্রহ করে কিছুক্ষণ পর আবার চেষ্টা করুন।';
      setError(`ছবি তৈরি করতে ব্যর্থ: ${errorMessage}`);
      toast({
        title: "ত্রুটি",
        description: `ছবি তৈরি করতে ব্যর্থ: ${errorMessage}`,
        variant: "destructive",
      });
    } finally {
      setLoadingImage(false);
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

  const handleDownloadImage = () => {
    if (generatedImageDataUri) {
      const link = document.createElement('a');
      link.href = generatedImageDataUri;
      link.download = 'memorial_image.png'; 
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast({ title: "ডাউনলোড শুরু হয়েছে", description: "ছবিটি ডাউনলোড করা হচ্ছে।" });
    }
  };

  return (
    <div className="container mx-auto py-12 px-4 md:px-6">
      <Card className="max-w-3xl mx-auto shadow-xl">
        <CardHeader className="text-center">
          <PenSquare className="h-12 w-12 mx-auto text-primary mb-2" />
          <CardTitle className="text-3xl font-headline">এআই চালিত স্মরণিকা ও স্মৃতিচিহ্ন তৈরি</CardTitle>
          <CardDescription>
            প্রিয়জনের জীবনের গল্প ও স্মৃতিগুলো সুন্দরভাবে তুলে ধরতে প্রয়োজনীয় তথ্য দিন। আমাদের এআই সিস্টেম একটি খসড়া স্মরণিকা এবং ঐচ্ছিকভাবে একটি স্মৃতিচিহ্নস্বরূপ ছবি তৈরি করতে সাহায্য করবে।
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onObituarySubmit)} className="space-y-6">
            <div>
              <Label htmlFor="deceasedName">মৃত ব্যক্তির পুরো নাম</Label>
              <Input id="deceasedName" {...register('deceasedName')} />
              {errors.deceasedName && <p className="text-destructive text-sm mt-1">{errors.deceasedName.message}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="dateOfBirth">জন্ম তারিখ (ঐচ্ছিক)</Label>
                <Controller
                  name="dateOfBirth"
                  control={control}
                  render={({ field }) => (
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {field.value ? format(field.value, "PPP", { locale: bn }) : <span>একটি তারিখ নির্বাচন করুন</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          captionLayout="dropdown-buttons"
                          fromYear={1900}
                          toYear={new Date().getFullYear()}
                          locale={bn}
                        />
                      </PopoverContent>
                    </Popover>
                  )}
                />
                {errors.dateOfBirth && <p className="text-destructive text-sm mt-1">{errors.dateOfBirth.message}</p>}
              </div>
              <div>
                <Label htmlFor="dateOfDeath">মৃত্যুর তারিখ</Label>
                 <Controller
                  name="dateOfDeath"
                  control={control}
                  render={({ field }) => (
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {field.value ? format(field.value, "PPP", { locale: bn }) : <span>একটি তারিখ নির্বাচন করুন</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          initialFocus
                          locale={bn}
                          captionLayout="dropdown-buttons"
                          fromYear={1900}
                          toYear={new Date().getFullYear()}
                        />
                      </PopoverContent>
                    </Popover>
                  )}
                />
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

            <Button type="submit" disabled={loadingObituary || loadingImage} className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
              {loadingObituary ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <PenSquare className="mr-2 h-4 w-4" />}
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
            <>
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

              <Separator className="my-8" />

              <Card className="mt-8 shadow-md border-primary">
                <CardHeader>
                  <CardTitle className="text-2xl font-headline text-primary flex items-center">
                    <ImageIcon className="mr-2 h-6 w-6" /> স্মরণিকার জন্য স্মৃতিচিহ্নস্বরূপ ছবি (ঐচ্ছিক)
                  </CardTitle>
                  <CardDescription>একটি থিম নির্বাচন করে স্মরণিকার জন্য একটি প্রাসঙ্গিক ছবি তৈরি করুন।</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="imageTheme">ছবির থিম নির্বাচন করুন</Label>
                    <Select 
                      value={selectedImageTheme} 
                      onValueChange={setSelectedImageTheme}
                      disabled={loadingImage || loadingObituary}
                    >
                      <SelectTrigger id="imageTheme">
                        <SelectValue placeholder="একটি থিম নির্বাচন করুন" />
                      </SelectTrigger>
                      <SelectContent>
                        {imageThemes.map(theme => (
                          <SelectItem key={theme.value} value={theme.value}>
                            {theme.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <Button onClick={handleGenerateImage} disabled={loadingImage || loadingObituary || !selectedImageTheme} className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
                    {loadingImage ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <ImageIcon className="mr-2 h-4 w-4" />}
                    ছবি তৈরি করুন
                  </Button>
                </CardContent>
                {generatedImageDataUri && (
                  <CardFooter className="flex flex-col items-center space-y-4 pt-4">
                    <div className="relative w-full max-w-md aspect-video rounded-md overflow-hidden border shadow-inner bg-muted">
                       <Image src={generatedImageDataUri} alt="তৈরি করা স্মৃতিচিহ্নস্বরূপ ছবি" layout="fill" objectFit="contain" data-ai-hint="memorial image"/>
                    </div>
                    <Button variant="outline" onClick={handleDownloadImage} className="w-full max-w-md">
                      <Download className="mr-2 h-4 w-4" /> ছবি ডাউনলোড করুন
                    </Button>
                  </CardFooter>
                )}
              </Card>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

