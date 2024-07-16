import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/src/lib/supabase";

export const useInsertOrderSubscription = () => {
  const queryClient = useQueryClient();

  useEffect(() => {
    const ordersSubscription = supabase
      .channel("custom-insert-channel")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "orders" },
        (payload) => {
          // console.log("Order Insert Change Received : ", payload);
          queryClient.invalidateQueries({ queryKey: ["orders"] });
        }
      )
      .subscribe();

    return () => {
      ordersSubscription.unsubscribe();
    };
  }, []);
};

export const useUpdateOrderSubscription = (id: number) => {
  const queryClient = useQueryClient();

  useEffect(() => {
    const orders = supabase
      .channel("custom-filter-channel")
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "orders",
          filter: `id=eq.${id}`,
        },
        (payload) => {
          // console.log("Order Update Change Received : ", payload);
          queryClient.invalidateQueries({ queryKey: ["orders", id] });
        }
      )
      .subscribe();

    return () => {
      orders.unsubscribe();
    };
  }, []);
};
