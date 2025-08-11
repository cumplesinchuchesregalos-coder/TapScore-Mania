"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ArrowLeft, Check, Lock, Gem } from "lucide-react";
import { SHOP_ITEMS, type ShopItem } from "@/lib/shop-items";

interface ShopScreenProps {
  currency: number;
  unlockedItems: string[];
  activeItem: string;
  onPurchase: (item: ShopItem) => void;
  onEquip: (itemId: string) => void;
  onBack: () => void;
}

export function ShopScreen({ currency, unlockedItems, activeItem, onPurchase, onEquip, onBack }: ShopScreenProps) {
  return (
    <div className="flex flex-col h-full bg-card">
      <header className="flex items-center p-4 border-b shrink-0">
        <Button variant="ghost" size="icon" onClick={onBack} className="rounded-full">
          <ArrowLeft />
        </Button>
        <h2 className="text-2xl font-headline font-bold text-center flex-1">Shop</h2>
        <div className="font-bold text-lg text-primary flex items-center gap-2 bg-muted px-3 py-1 rounded-full">
            <Gem className="h-5 w-5 text-accent-foreground" />
            {currency}
        </div>
      </header>
      <ScrollArea className="flex-1">
        <div className="p-4">
            <h3 className="text-lg font-semibold text-muted-foreground mb-4 px-2">Circle Styles</h3>
            <div className="grid grid-cols-2 gap-4">
            {SHOP_ITEMS.map(item => {
                const isUnlocked = unlockedItems.includes(item.id);
                const isActive = activeItem === item.id;
                const canAfford = currency >= item.price;
                
                return (
                <Card key={item.id} className="flex flex-col text-center shadow-md transition-transform hover:scale-105">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">{item.name}</CardTitle>
                    </CardHeader>
                    <CardContent className="flex-1 flex items-center justify-center p-4">
                      <div className={`w-16 h-16 transition-all duration-300 ${item.className} ${isActive ? 'ring-4 ring-offset-2 ring-primary' : ''}`}></div>
                    </CardContent>
                    <CardFooter className="p-2">
                    {isUnlocked ? (
                        <Button onClick={() => onEquip(item.id)} disabled={isActive} className="w-full rounded-full">
                        {isActive && <Check className="mr-2 h-4 w-4" />}
                        {isActive ? "Equipped" : "Equip"}
                        </Button>
                    ) : (
                        <Button onClick={() => onPurchase(item)} disabled={!canAfford} className="w-full rounded-full">
                        <Lock className="mr-2 h-4 w-4" />
                        {item.price}
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
