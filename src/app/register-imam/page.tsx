
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
import { UserPlus, Loader2, AlertTriangle, ImageUp } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import Image from 'next/image';

const imamRegistrationSchema = z.object({
  name: z.string().min(1, 'ইমামের নাম আবশ্যক'),
  mosque: z.string().min(1, 'মসজিদ/এলাকার নাম আবশ্যক'),
  phone: z.string().min(1, 'ফোন নম্বর আবশ্যক').regex(/^01[3-9]\d{8}$/, 'সঠিক বাংলাদেশী ফোন নম্বর দিন (যেমন: 01xxxxxxxxx)'),
  expertise: z.string().min(1, 'বিশেষত্ব উল্লেখ করুন'),
  image: z.string().optional(), // Will store Data URI
});

type ImamRegistrationFormValues = z.infer<typeof imamRegistrationSchema>;

export interface ImamEntry {
  id: string;
  name: string;
  mosque: string;
  phone: string;
  expertise: string;
  image?: string; // Data URI for the image
}

export default function RegisterImamPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    reset,
  } = useForm<ImamRegistrationFormValues>({
    resolver: zodResolver(imamRegistrationSchema),
  });

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) { // 2MB limit
        toast({
          title: "ফাইলের আকার বড়",
          description: "অনুগ্রহ করে ২MB এর চেয়ে ছোট ছবি আপলোড করুন।",
          variant: "destructive",
        });
        event.target.value = ''; // Clear the input
        setImagePreview(null);
        setValue('image', undefined);
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        const dataUri = reader.result as string;
        setImagePreview(dataUri);
        setValue('image', dataUri); 
      };
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
      setValue('image', undefined);
    }
  };

  const onSubmit: SubmitHandler<ImamRegistrationFormValues> = async (data) => {
    setLoading(true);
    setError(null);

    try {
      const newImam: ImamEntry = {
        id: crypto.randomUUID(), // Generate a unique ID
        ...data,
        image: data.image, // Already a Data URI
      };

      const existingImamsString = localStorage.getItem('registeredImams');
      const existingImams: ImamEntry[] = existingImamsString ? JSON.parse(existingImamsString) : [];
      
      existingImams.push(newImam);
      localStorage.setItem('registeredImams', JSON.stringify(existingImams));

      toast({
        title: "ইমাম রেজিস্টার্ড",
        description: `${data.name} সফলভাবে রেজিস্টার্ড হয়েছেন।`,
      });
      reset();
      setImagePreview(null);
    } catch (e) {
      console.error(e);
      const errorMessage = e instanceof Error ? e.message : 'একটি অজানা ত্রুটি ঘটেছে।';
      setError(`ইমাম রেজিস্ট্রেশনে ব্যর্থ: ${errorMessage}`);
      toast({
        title: "ত্রুটি",
        description: `ইমাম রেজিস্ট্রেশনে ব্যর্থ: ${errorMessage}`,
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
          <UserPlus className="h-12 w-12 mx-auto text-primary mb-2" />
          <CardTitle className="text-3xl font-headline">নতুন ইমাম রেজিস্ট্রেশন</CardTitle>
          <CardDescription>
            অনুগ্রহ করে ইমাম সম্পর্কিত তথ্য পূরণ করুন। এই তথ্য লোকাল স্টোরেজে সংরক্ষিত হবে। ছবি আপলোড ঐচ্ছিক।
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <Label htmlFor="name">ইমামের পুরো নাম</Label>
              <Input id="name" {...register('name')} placeholder="যেমন: মাওলানা আব্দুল্লাহ আল-আমিন" />
              {errors.name && <p className="text-destructive text-sm mt-1">{errors.name.message}</p>}
            </div>

            <div>
              <Label htmlFor="mosque">মসজিদ/এলাকার নাম</Label>
              <Input id="mosque" {...register('mosque')} placeholder="যেমন: বায়তুল ফালাহ জামে মসজিদ, চট্টগ্রাম" />
              {errors.mosque && <p className="text-destructive text-sm mt-1">{errors.mosque.message}</p>}
            </div>
            
            <div>
              <Label htmlFor="phone">ফোন নম্বর</Label>
              <Input id="phone" type="tel" {...register('phone')} placeholder="যেমন: 01712345678" />
              {errors.phone && <p className="text-destructive text-sm mt-1">{errors.phone.message}</p>}
            </div>

            <div>
              <Label htmlFor="expertise">বিশেষত্ব ও অভিজ্ঞতা</Label>
              <Textarea 
                id="expertise" 
                {...register('expertise')} 
                rows={3}
                placeholder="যেমন: জানাজার নামাজ পরিচালনা, ইসলামি আলোচনা, শুক্রবারের খুতবা ইত্যাদি।"
              />
              {errors.expertise && <p className="text-destructive text-sm mt-1">{errors.expertise.message}</p>}
            </div>
            
            <div>
              <Label htmlFor="imageFile">ইমামের ছবি (ঐচ্ছিক, সর্বোচ্চ ২MB)</Label>
              <div className="flex items-center space-x-4">
                <Input 
                  id="imageFile" 
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
                <div className="mt-4 relative w-32 h-32 rounded-md overflow-hidden border shadow-sm">
                  <Image src={imagePreview} alt="ইমামের ছবির প্রিভিউ" layout="fill" objectFit="cover" data-ai-hint="imam profile preview" />
                </div>
              )}
              {errors.image && <p className="text-destructive text-sm mt-1">{errors.image.message}</p>}
            </div>


            <Button type="submit" disabled={loading} className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
              {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <UserPlus className="mr-2 h-4 w-4" />}
              রেজিস্টার করুন
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
        </CardContent>
      </Card>
    </div>
  );
}

