
'use client';

import { useState } from 'react';
import { useForm, type SubmitHandler, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, AlertTriangle, Send, Copy, MessageCircle, Users, MessageCircleCode } from 'lucide-react';
import { generateInvitation, type GenerateInvitationInput, type GenerateInvitationOutput, GenerateInvitationInputSchema } from '@/ai/flows/generate-invitation-flow';
import { useToast } from "@/hooks/use-toast";

const invitationSchema = GenerateInvitationInputSchema;
type InvitationFormValues = GenerateInvitationInput;

export default function InvitationAssistancePage() {
  const [loading, setLoading] = useState(false);
  const [generatedInvitation, setGeneratedInvitation] = useState<GenerateInvitationOutput | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<InvitationFormValues>({
    resolver: zodResolver(invitationSchema),
    defaultValues: {
      eventType: 'জানাজা', 
    }
  });

  const onSubmit: SubmitHandler<InvitationFormValues> = async (data) => {
    setLoading(true);
    setError(null);
    setGeneratedInvitation(null);

    try {
      const result = await generateInvitation(data);
      setGeneratedInvitation(result);
      toast({
        title: "আমন্ত্রণপত্র প্রস্তুত",
        description: "এআই দ্বারা আমন্ত্রণ বার্তা তৈরি করা হয়েছে।",
      });
    } catch (e) {
      console.error(e);
      const errorMessage = e instanceof Error ? e.message : 'একটি অজানা ত্রুটি ঘটেছে।';
      setError(`আমন্ত্রণ বার্তা তৈরি করতে ব্যর্থ: ${errorMessage}`);
      toast({
        title: "ত্রুটি",
        description: `আমন্ত্রণ বার্তা তৈরি করতে ব্যর্থ: ${errorMessage}`,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCopyToClipboard = () => {
    if (generatedInvitation?.invitationText) {
      navigator.clipboard.writeText(generatedInvitation.invitationText)
        .then(() => {
          toast({ title: "কপি করা হয়েছে", description: "আমন্ত্রণ বার্তা ক্লিপবোর্ডে কপি করা হয়েছে।" });
        })
        .catch(err => {
          toast({ title: "কপি করতে ব্যর্থ", description: "আমন্ত্রণ বার্তা কপি করা যায়নি।", variant: "destructive" });
          console.error('Failed to copy: ', err);
        });
    }
  };

  return (
    <div className="container mx-auto py-12 px-4 md:px-6">
      <Card className="max-w-2xl mx-auto shadow-xl">
        <CardHeader className="text-center">
          <Users className="h-12 w-12 mx-auto text-primary mb-2" />
          <CardTitle className="text-3xl font-headline">আমন্ত্রণ সহায়তা</CardTitle>
          <CardDescription>
            জানাজা, দোয়া মাহফিল বা অন্যান্য অনুষ্ঠানের জন্য এআই-এর সাহায্যে দ্রুত আমন্ত্রণ বার্তা তৈরি করুন।
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <Label htmlFor="deceasedName">মৃত ব্যক্তির নাম</Label>
              <Input id="deceasedName" {...register('deceasedName')} placeholder="মরহুম/মরহুমা ..." />
              {errors.deceasedName && <p className="text-destructive text-sm mt-1">{errors.deceasedName.message}</p>}
            </div>

            <div>
              <Label htmlFor="eventType">অনুষ্ঠানের প্রকার</Label>
              <Controller
                name="eventType"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <SelectTrigger id="eventType">
                      <SelectValue placeholder="অনুষ্ঠানের প্রকার নির্বাচন করুন" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="জানাজা">জানাজা</SelectItem>
                      <SelectItem value="দাফন">দাফন</SelectItem>
                      <SelectItem value="দোয়া মাহফিল">দোয়া মাহফিল</SelectItem>
                      <SelectItem value="কুলখানি">কুলখানি</SelectItem>
                      <SelectItem value="অন্যান্য">অন্যান্য</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.eventType && <p className="text-destructive text-sm mt-1">{errors.eventType.message}</p>}
            </div>

            <div>
              <Label htmlFor="eventDateTime">অনুষ্ঠানের তারিখ ও সময়</Label>
              <Input id="eventDateTime" {...register('eventDateTime')} placeholder="যেমন: ২৫শে ডিসেম্বর, ২০২৪, দুপুর ২:০০ ঘটিকায়" />
              {errors.eventDateTime && <p className="text-destructive text-sm mt-1">{errors.eventDateTime.message}</p>}
            </div>

            <div>
              <Label htmlFor="eventLocation">অনুষ্ঠানের স্থান</Label>
              <Input id="eventLocation" {...register('eventLocation')} placeholder="যেমন: বায়তুল মোকাররম মসজিদ / মরহুমের নিজ বাসভবন" />
              {errors.eventLocation && <p className="text-destructive text-sm mt-1">{errors.eventLocation.message}</p>}
            </div>
            
            <div>
              <Label htmlFor="hostName">আমন্ত্রণকারী/আয়োজকের নাম (ঐচ্ছিক)</Label>
              <Input id="hostName" {...register('hostName')} placeholder="যেমন: শোকসন্তপ্ত পরিবারবর্গ" />
              {errors.hostName && <p className="text-destructive text-sm mt-1">{errors.hostName.message}</p>}
            </div>

            <div>
              <Label htmlFor="additionalMessage">অতিরিক্ত বার্তা (ঐচ্ছিক)</Label>
              <Textarea id="additionalMessage" {...register('additionalMessage')} rows={3} placeholder="বিশেষ কোনো অনুরোধ বা তথ্য থাকলে লিখুন"/>
              {errors.additionalMessage && <p className="text-destructive text-sm mt-1">{errors.additionalMessage.message}</p>}
            </div>

            <Button type="submit" disabled={loading} className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
              {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
              আমন্ত্রণ বার্তা তৈরি করুন
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

          {generatedInvitation && (
            <Card className="mt-8 shadow-md border-accent">
              <CardHeader>
                <CardTitle className="text-2xl font-headline text-accent flex items-center">
                  <Send className="mr-2 h-6 w-6" /> তৈরি করা আমন্ত্রণ বার্তা
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea value={generatedInvitation.invitationText} readOnly rows={5} className="bg-muted/50 border-input"/>
                <div className="flex flex-col sm:flex-row gap-2 mt-4">
                  <Button variant="outline" onClick={handleCopyToClipboard} className="w-full">
                    <Copy className="mr-2 h-4 w-4" /> বার্তা কপি করুন
                  </Button>
                  <a href={generatedInvitation.smsLink} target="_blank" rel="noopener noreferrer" className="w-full">
                    <Button variant="outline" className="w-full">
                       <MessageCircle className="mr-2 h-4 w-4" /> SMS পাঠান
                    </Button>
                  </a>
                  <a href={generatedInvitation.whatsappLink} target="_blank" rel="noopener noreferrer" className="w-full">
                     <Button variant="outline" className="w-full">
                        <MessageCircleCode className="mr-2 h-4 w-4" />
                        WhatsApp এ পাঠান
                    </Button>
                  </a>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  "SMS পাঠান" বা "WhatsApp এ পাঠান" বাটনে ক্লিক করলে আপনার ডিভাইসের সংশ্লিষ্ট অ্যাপটি খুলবে এবং বার্তাটি সেখানে পেস্ট হয়ে যাবে। আপনি এরপর প্রাপক নির্বাচন করে পাঠাতে পারবেন।
                </p>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
