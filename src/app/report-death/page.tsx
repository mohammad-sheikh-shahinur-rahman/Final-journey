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
import { cn } from '@/lib/utils';

const deathReportSchema = z.object({
  deceasedName: z.string().min(1, 'Deceased name is required'),
  address: z.string().min(1, 'Address is required'),
  timeOfDeathDate: z.date({ required_error: "Date of death is required." }),
  timeOfDeathTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Invalid time format (HH:MM)"),
  contactPersonName: z.string().min(1, 'Contact person name is required'),
  contactPersonPhone: z.string().min(1, 'Contact person phone is required'),
  contactPersonEmail: z.string().email('Invalid email address').optional().or(z.literal('')),
  localMasjidSchedule: z.string().min(1, 'Local Masjid schedule is required'),
  location: z.string().min(1, 'General location is required'),
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
      const timeOfDeathISO = new Date(`${format(data.timeOfDeathDate, 'yyyy-MM-dd')}T${data.timeOfDeathTime}:00`).toISOString();
      
      const aiInput: SuggestJanazaTimeInput = {
        timeOfDeath: timeOfDeathISO,
        localMasjidSchedule: data.localMasjidSchedule,
        location: data.location,
      };

      const result = await suggestJanazaTime(aiInput);
      setJanazaSuggestions(result);
      toast({
        title: "Suggestions Ready",
        description: "Janaza time suggestions have been generated.",
      });
    } catch (e) {
      console.error(e);
      const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
      setError(`Failed to get Janaza time suggestions: ${errorMessage}`);
      toast({
        title: "Error",
        description: `Failed to get suggestions: ${errorMessage}`,
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
          <CardTitle className="text-3xl font-headline">Report a Death</CardTitle>
          <CardDescription>
            Please provide the necessary details to proceed with funeral arrangements and receive Janaza time suggestions.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <Label htmlFor="deceasedName">Deceased's Full Name</Label>
              <Input id="deceasedName" {...register('deceasedName')} />
              {errors.deceasedName && <p className="text-destructive text-sm mt-1">{errors.deceasedName.message}</p>}
            </div>

            <div>
              <Label htmlFor="address">Address of Deceased</Label>
              <Input id="address" {...register('address')} />
              {errors.address && <p className="text-destructive text-sm mt-1">{errors.address.message}</p>}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="timeOfDeathDate">Date of Death</Label>
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
                      {selectedDate ? format(selectedDate, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={(date) => setValue('timeOfDeathDate', date || new Date())}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                {errors.timeOfDeathDate && <p className="text-destructive text-sm mt-1">{errors.timeOfDeathDate.message}</p>}
              </div>
              <div>
                <Label htmlFor="timeOfDeathTime">Time of Death (24h format, e.g., 14:30)</Label>
                <div className="relative">
                  <ClockIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input id="timeOfDeathTime" type="time" {...register('timeOfDeathTime')} className="pl-10"/>
                </div>
                {errors.timeOfDeathTime && <p className="text-destructive text-sm mt-1">{errors.timeOfDeathTime.message}</p>}
              </div>
            </div>


            <div>
              <Label htmlFor="contactPersonName">Contact Person's Name</Label>
              <Input id="contactPersonName" {...register('contactPersonName')} />
              {errors.contactPersonName && <p className="text-destructive text-sm mt-1">{errors.contactPersonName.message}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="contactPersonPhone">Contact Person's Phone</Label>
                <Input id="contactPersonPhone" type="tel" {...register('contactPersonPhone')} />
                {errors.contactPersonPhone && <p className="text-destructive text-sm mt-1">{errors.contactPersonPhone.message}</p>}
              </div>
              <div>
                <Label htmlFor="contactPersonEmail">Contact Person's Email (Optional)</Label>
                <Input id="contactPersonEmail" type="email" {...register('contactPersonEmail')} />
                {errors.contactPersonEmail && <p className="text-destructive text-sm mt-1">{errors.contactPersonEmail.message}</p>}
              </div>
            </div>

            <div>
              <Label htmlFor="location">General Location (e.g., City, Area)</Label>
              <Input id="location" {...register('location')} />
              {errors.location && <p className="text-destructive text-sm mt-1">{errors.location.message}</p>}
            </div>
            
            <div>
              <Label htmlFor="localMasjidSchedule">Local Masjid Prayer Schedule</Label>
              <Textarea
                id="localMasjidSchedule"
                {...register('localMasjidSchedule')}
                placeholder="e.g., Fajr: 5:30 AM, Dhuhr: 1:30 PM, Asr: 5:00 PM, Maghrib: Sunset, Isha: 8:30 PM"
                rows={4}
              />
              {errors.localMasjidSchedule && <p className="text-destructive text-sm mt-1">{errors.localMasjidSchedule.message}</p>}
            </div>

            <Button type="submit" disabled={loading} className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
              {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Brain className="mr-2 h-4 w-4" />}
              Submit and Get Janaza Time Suggestions
            </Button>
          </form>

          {error && (
            <div className="mt-6 p-4 bg-destructive/10 border border-destructive/30 rounded-md text-destructive">
              <div className="flex items-center">
                <AlertTriangle className="h-5 w-5 mr-2" />
                <p className="font-medium">Error</p>
              </div>
              <p className="text-sm">{error}</p>
            </div>
          )}

          {janazaSuggestions && (
            <Card className="mt-8 shadow-md border-accent">
              <CardHeader>
                <CardTitle className="text-2xl font-headline text-accent flex items-center">
                  <CalendarIcon className="mr-2 h-6 w-6" /> AI Suggested Janaza Times
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold text-lg mb-2">Suggested Times:</h4>
                  <ul className="list-disc list-inside space-y-1">
                    {janazaSuggestions.suggestedTimes.map((time, index) => (
                      <li key={index} className="text-foreground">
                        {new Date(time).toLocaleString('en-BD', { dateStyle: 'full', timeStyle: 'short', timeZone: 'Asia/Dhaka' })}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-lg mb-2">Reasoning:</h4>
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
