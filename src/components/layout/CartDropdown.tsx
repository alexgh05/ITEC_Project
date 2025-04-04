import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuGroup,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { ShoppingBag, Trash2, Plus, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link, useNavigate } from "react-router-dom";
import { useCartStore } from "@/store/useCartStore";
import { ScrollArea } from "@/components/ui/scroll-area";

const CartDropdown = () => {
  const { items, getTotalItems, getTotalPrice, removeItem, updateQuantity } = useCartStore();
  const totalItems = getTotalItems();
  const navigate = useNavigate();
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" aria-label="Shopping cart">
          <div className="relative">
            <ShoppingBag size={20} />
            {totalItems > 0 && (
              <Badge
                className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 font-bold text-[10px]"
                variant="destructive"
              >
                {totalItems}
              </Badge>
            )}
          </div>
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuLabel className="flex justify-between">
          <span>Shopping Cart</span>
          <span>{totalItems} {totalItems === 1 ? 'item' : 'items'}</span>
        </DropdownMenuLabel>
        
        <DropdownMenuSeparator />
        
        {items.length === 0 ? (
          <div className="p-4 text-center text-muted-foreground">
            Your cart is empty
          </div>
        ) : (
          <ScrollArea className="h-[300px]">
            <DropdownMenuGroup>
              {items.map((item) => (
                <DropdownMenuItem key={item.id} className="flex flex-col items-stretch p-0 focus:bg-transparent">
                  <div className="flex p-2 items-start gap-3">
                    <div className="h-16 w-16 rounded overflow-hidden bg-secondary flex-shrink-0">
                      <img src={item.images[0]} alt={item.name} className="h-full w-full object-cover" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="font-medium truncate">{item.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {item.culture} {item.selectedSize && `• Size: ${item.selectedSize}`}
                      </div>
                      <div className="font-semibold mt-1">${item.price.toFixed(2)}</div>
                      
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center bg-secondary rounded-md">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-7 w-7 rounded-r-none"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                          >
                            <Minus size={14} />
                          </Button>
                          
                          <span className="w-8 text-center text-sm">{item.quantity}</span>
                          
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-7 w-7 rounded-l-none"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          >
                            <Plus size={14} />
                          </Button>
                        </div>
                        
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-7 w-7 text-destructive"
                          onClick={() => removeItem(item.id)}
                        >
                          <Trash2 size={14} />
                        </Button>
                      </div>
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                </DropdownMenuItem>
              ))}
            </DropdownMenuGroup>
          </ScrollArea>
        )}
        
        {items.length > 0 && (
          <>
            <div className="p-4 space-y-4">
              <div className="flex justify-between font-medium">
                <span>Total:</span>
                <span>${getTotalPrice().toFixed(2)}</span>
              </div>
              
              <div className="grid grid-cols-2 gap-2">
                <Button variant="outline" asChild>
                  <Link to="/cart">View Cart</Link>
                </Button>
                <Button onClick={() => navigate('/checkout')}>Checkout</Button>
              </div>
            </div>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default CartDropdown; 