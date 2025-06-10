
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Globe, UserCircle, Briefcase } from 'lucide-react';

export default function DeveloperInfoPage() {
  const developer = {
    name: 'মোহাম্মদ শেখ শাহিনুর রহমান',
    titles: [
      'কবি',
      'লেখক',
      'সফটওয়্যার ইঞ্জিনিয়ার',
      'প্রোগ্রামার',
      'ডিজিটাল ফরেনসিক বিশেষজ্ঞ',
      'প্রযুক্তি উদ্ভাবক',
    ],
    imageUrl: 'https://m.media-amazon.com/images/S/amzn-author-media-prod/b02mvc2hucu96hchlksdjmogii._SY450_CR0%2C0%2C450%2C450_.jpg',
    websites: [
      { name: 'ব্যক্তিগত ওয়েবসাইট', url: 'https://mohammad-sheikh-shahinur-rahman.vercel.app/' },
      { name: 'আমাদের সমাজ', url: 'https://shahinur.amadersomaj.com/' },
    ],
  };

  return (
    <div className="container mx-auto py-12 px-4 md:px-6 flex justify-center">
      <Card className="w-full max-w-2xl shadow-xl">
        <CardHeader className="text-center items-center">
          <div className="relative h-32 w-32 md:h-40 md:w-40 rounded-full overflow-hidden border-4 border-primary mb-4">
            <Image
              src={developer.imageUrl}
              alt={developer.name}
              layout="fill"
              objectFit="cover"
              data-ai-hint="developer portrait"
            />
          </div>
          <CardTitle className="text-3xl font-headline text-primary">{developer.name}</CardTitle>
          <CardDescription className="text-lg text-muted-foreground mt-1">
            {developer.titles.join(' | ')}
          </CardDescription>
        </CardHeader>
        <CardContent className="mt-4">
          <div className="text-center">
            <h3 className="text-xl font-semibold text-foreground mb-3 flex items-center justify-center">
              <Globe className="mr-2 h-6 w-6 text-accent" /> আরও জানুন
            </h3>
            <div className="space-y-3 flex flex-col items-center">
              {developer.websites.map((site) => (
                <Link key={site.name} href={site.url} passHref legacyBehavior>
                  <a target="_blank" rel="noopener noreferrer" className="w-full max-w-xs">
                    <Button variant="outline" className="w-full border-accent text-accent hover:bg-accent/10">
                      {site.name}
                    </Button>
                  </a>
                </Link>
              ))}
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-center pt-6">
          <p className="text-sm text-muted-foreground">
            প্রযুক্তি ও সৃষ্টিশীলতার মেলবন্ধনে।
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
