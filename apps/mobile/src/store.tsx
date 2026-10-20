import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { Product } from "./types";

const BASKET_KEY = "wickford.basket.v1";
const ORDERS_KEY = "wickford.orders.v1";

export type BasketItem = {
  partNumber: string;
  brand: string;
  description: string;
  pricePence: number;
  priceNote: string;
  qty: number;
};

export type SavedOrder = { id: string; email: string };

type Store = {
  ready: boolean;
  items: BasketItem[];
  count: number;
  subtotalPence: number;
  add: (product: Pick<Product, "partNumber" | "brand" | "description" | "pricePence" | "priceNote">, qty?: number) => void;
  setQty: (partNumber: string, qty: number) => void;
  clear: () => void;
  orders: SavedOrder[];
  rememberOrder: (order: SavedOrder) => void;
};

const Ctx = createContext<Store | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<BasketItem[]>([]);
  const [orders, setOrders] = useState<SavedOrder[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    Promise.all([AsyncStorage.getItem(BASKET_KEY), AsyncStorage.getItem(ORDERS_KEY)])
      .then(([basketRaw, ordersRaw]) => {
        if (basketRaw) setItems(JSON.parse(basketRaw) as BasketItem[]);
        if (ordersRaw) setOrders(JSON.parse(ordersRaw) as SavedOrder[]);
      })
      .finally(() => setReady(true));
  }, []);

  useEffect(() => {
    if (ready) AsyncStorage.setItem(BASKET_KEY, JSON.stringify(items)).catch(() => undefined);
  }, [items, ready]);

  useEffect(() => {
    if (ready) AsyncStorage.setItem(ORDERS_KEY, JSON.stringify(orders)).catch(() => undefined);
  }, [orders, ready]);

  const value = useMemo<Store>(() => {
    const count = items.reduce((sum, item) => sum + item.qty, 0);
    const subtotalPence = items.reduce((sum, item) => sum + item.qty * item.pricePence, 0);
    return {
      ready,
      items,
      count,
      subtotalPence,
      add: (product, qty = 1) => {
        setItems((current) => {
          const existing = current.find((item) => item.partNumber === product.partNumber);
          if (existing) {
            return current.map((item) =>
              item.partNumber === product.partNumber ? { ...item, qty: item.qty + qty } : item,
            );
          }
          return [...current, { ...product, qty }];
        });
      },
      setQty: (partNumber, qty) => {
        setItems((current) =>
          qty <= 0 ? current.filter((item) => item.partNumber !== partNumber) : current.map((item) => (item.partNumber === partNumber ? { ...item, qty } : item)),
        );
      },
      clear: () => setItems([]),
      orders,
      rememberOrder: (order) => {
        setOrders((current) => [order, ...current.filter((item) => item.id !== order.id)].slice(0, 30));
      },
    };
  }, [items, orders, ready]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useStore(): Store {
  const value = useContext(Ctx);
  if (!value) throw new Error("Store missing");
  return value;
}
