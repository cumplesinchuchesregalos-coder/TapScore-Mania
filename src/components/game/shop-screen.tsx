
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ArrowLeft, Check, Lock, Gem, Loader2 } from "lucide-react";
import { type ShopItem } from "@/lib/shop-items";
import { useLanguage } from "@/context/language-context";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { Skeleton } from "@/components/ui/skeleton";


interface ShopScreenProps {
  currency: number;
  shopItems: ShopItem[];
  unlockedItems: string[];
  activeItem: string;
  onPurchase: (item: ShopItem) => void;
  onEquip: (itemId: string) => void;
  onBack: () => void;
  isGeneratingImages: boolean;
}

export function ShopScreen({ currency, shopItems, unlockedItems, activeItem, onPurchase, onEquip, onBack, isGeneratingImages }: ShopScreenProps) {
  const { t } = useLanguage();
  return (
    <div className="flex flex-col h-full bg-card">
      <header className="flex items-center p-4 border-b shrink-0">
        <Button variant="ghost" size="icon" onClick={onBack} className="rounded-full">
          <ArrowLeft />
        </Button>
        <h2 className="text-2xl font-headline font-bold text-center flex-1">{t.shop.title}</h2>
        <div className="font-bold text-lg text-primary flex items-center gap-2 bg-muted px-3 py-1 rounded-full">
            <Gem className="h-5 w-5 text-accent-foreground" />
            {currency}
        </div>
      </header>
      <ScrollArea className="flex-1">
        <div className="p-4">
            <h3 className="text-lg font-semibold text-muted-foreground mb-4 px-2">{t.shop.circleStyles}</h3>
            <div className="grid grid-cols-2 gap-4">
            {shopItems.map(item => {
                const isUnlocked = unlockedItems.includes(item.id);
                const isActive = activeItem === item.id;
                const canAfford = currency >= item.price;
                const isGenerating = isGeneratingImages && item.imageHint;
                
                return (
                <Card key={item.id} className="flex flex-col text-center shadow-md transition-transform hover:scale-105">
                    <CardHeader className="pb-2 flex-grow">
                      <CardTitle className="text-base">{t.shopItems[item.id]?.name || item.name}</CardTitle>
                      <CardDescription className="text-xs h-10">{t.shopItems[item.id]?.description || ''}</CardDescription>
                    </CardHeader>
                    <CardContent className="flex items-center justify-center p-4 flex-grow">
                      <div className={cn('w-16 h-16 transition-all duration-300 flex items-center justify-center', isActive ? 'ring-4 ring-offset-2 ring-primary rounded-full' : '')}>
                        {isGenerating ? (
                           <Skeleton className="w-16 h-16 rounded-full" />
                        ) : item.imageUrl ? (
                          <Image 
                            src={item.imageUrl} 
                            alt={t.shopItems[item.id]?.name || item.name}
                            width={64}
                            height={64}
                            className="object-contain"
                          />
                        ) : (
                           <div className={cn('w-full h-full', item.className)}></div>
                        )}
                      </div>
                    </CardContent>
                    <CardFooter className="p-2">
                    {isUnlocked ? (
                        <Button onClick={() => onEquip(item.id)} disabled={isActive} className="w-full rounded-full">
                        {isActive && <Check className="mr-2 h-4 w-4" />}
                        {isActive ? t.shop.equipped : t.shop.equip}
                        </Button>
                    ) : (
                        <Button onClick={() => onPurchase(item)} disabled={!canAfford || isGenerating} className="w-full rounded-full">
                        {isGenerating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Lock className="mr-2 h-4 w-4" />}
                        {isGenerating ? "..." : item.price}
                        </Button>
                    )}
                    </CardFooter>
                </Card>
                );
            })}
            </div>
        </div>
      </ScrollArea>
    </div>
  );
}
