
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Globe, UserCircle } from 'lucide-react'; // Briefcase was unused, so removed for now.

const newGlobalImageUrl = "https://i.ibb.co/8ggZLNpJ/AIRetouch-20250610-115309345.jpg";

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
    imageUrl: newGlobalImageUrl, // Using the new global image URL
    bio: 'মোহাম্মদ শেখ শাহিনুর রহমান একজন বহুমাত্রিক প্রতিভার অধিকারী ব্যক্তিত্ব। তিনি একাধারে একজন সৃজনশীল কবি ও লেখক, এবং অন্যদিকে একজন দূরদর্শী সফটওয়্যার ইঞ্জিনিয়ার, প্রোগ্রামার ও প্রযুক্তি উদ্ভাবক। ডিজিটাল সুরক্ষার ক্ষেত্রেও রয়েছে তার পদচারণা, যেখানে তিনি ডিজিটাল ফরেনসিক বিশেষজ্ঞ হিসেবে কাজ করেন। জ্ঞান, সৃজনশীলতা এবং প্রযুক্তির সমন্বয়ে তিনি মানবকল্যাণে অবদান রাখতে সদা সচেষ্ট।',
    websites: [
      { name: 'ব্যক্তিগত ওয়েবসাইট', url: 'https://mohammad-sheikh-shahinur-rahman.vercel.app/' },
      { name: 'আমাদের সমাজ', url: 'https://shahinur.amadersomaj.com/' },
    ],
  };

  return (
    <div className="container mx-auto py-12 px-4 md:px-6 flex justify-center">
      <Card className="w-full max-w-2xl shadow-xl">
        <CardHeader className="text-center items-center pb-6">
          <div className="relative h-32 w-32 md:h-40 md:w-40 rounded-full overflow-hidden border-4 border-primary mb-4">
            <Image
              src={developer.imageUrl}
              alt={developer.name}
              layout="fill"
              objectFit="cover"
              data-ai-hint="profile image"
            />
          </div>
          <CardTitle className="text-3xl font-headline text-primary">{developer.name}</CardTitle>
          <CardDescription className="text-lg text-muted-foreground mt-1">
            {developer.titles.join(' | ')}
          </CardDescription>
        </CardHeader>

        <CardContent className="border-t pt-6">
          <h3 className="text-xl font-semibold text-foreground mb-3 flex items-center justify-center">
            <UserCircle className="mr-2 h-6 w-6 text-accent" />
            আমার সম্পর্কে
          </h3>
          <p className="text-muted-foreground text-center leading-relaxed max-w-xl mx-auto text-sm">
            {developer.bio}
          </p>
        </CardContent>

        <CardContent className="border-t pt-6">
          <div className="text-center">
            <h3 className="text-xl font-semibold text-foreground mb-3 flex items-center justify-center">
              <Globe className="mr-2 h-6 w-6 text-accent" /> আরও জানুন
            </h3>
            <div className="space-y-3 flex flex-col items-center">
              {developer.websites.map((site) => (
                <Link 
                  key={site.name} 
                  href={site.url} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="w-full max-w-xs"
                >
                  <Button variant="outline" className="w-full border-accent text-accent hover:bg-accent/10">
                    {site.name}
                  </Button>
                </Link>
              ))}
            </div>
          </div>
        </CardContent>
        
        <CardFooter className="flex justify-center pt-6 border-t">
          <p className="text-sm text-muted-foreground">
            প্রযুক্তি ও সৃষ্টিশীলতার মেলবন্ধনে।
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}

    