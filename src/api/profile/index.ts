import { supabase } from "@/src/lib/supabase";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { UpdateTables } from "@/src/types";

export const useProfile = (id: string) => {
  return useQuery({
    queryKey: ["profiles", id],
    queryFn: async () => {
      const { data: myProfile, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        throw new Error(error.message);
      }
      return myProfile;
    },
  });
};

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    async mutationFn(data: UpdateTables<"profiles">) {
      const { error, data: updatedProfile } = await supabase
        .from("profiles")
        .update({
          avatar_url: data.avatar_url,
          full_name: data.full_name,
          username: data.username,
          website: data.website,
        })
        .eq("id", data.id || "")
        .select()
        .single();

      if (error) {
        throw new Error(error.message);
      }
      return updatedProfile;
    },
    async onSuccess(_, { id }) {
      await queryClient.invalidateQueries({ queryKey: ["profiles"] });
      await queryClient.invalidateQueries({ queryKey: ["profiles", id] });
    },
  });
};
