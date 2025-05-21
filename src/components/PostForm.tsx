
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormField, FormItem, FormControl } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Send } from 'lucide-react';

interface PostFormValues {
  content: string;
  media?: File;
}

const PostForm: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<PostFormValues>({
    defaultValues: {
      content: '',
    }
  });

  const onSubmit = async (values: PostFormValues) => {
    if (!user) return;
    
    setIsSubmitting(true);
    try {
      let mediaUrl = null;
      
      // Upload media file if provided
      if (values.media) {
        const fileExt = values.media.name.split('.').pop();
        const filePath = `${user.id}/${Math.random().toString(36).substring(2)}.${fileExt}`;
        
        // Upload the file to Supabase Storage
        const { error: uploadError } = await supabase
          .storage
          .from('posts')
          .upload(filePath, values.media);
          
        if (uploadError) {
          throw uploadError;
        }
        
        // Get the public URL
        const { data: publicUrlData } = supabase
          .storage
          .from('posts')
          .getPublicUrl(filePath);
          
        mediaUrl = publicUrlData.publicUrl;
      }
      
      // Create post in database
      const { error } = await supabase
        .from('posts')
        .insert({
          content: values.content,
          media_url: mediaUrl,
          created_by: user.id
        });
        
      if (error) throw error;
      
      // Reset form
      form.reset();
      setSelectedFile(null);
      
      toast({
        title: "Postagem criada",
        description: "Sua postagem foi publicada com sucesso!",
      });
      
    } catch (error) {
      console.error('Error creating post:', error);
      toast({
        title: "Erro",
        description: "Não foi possível criar a postagem",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
      form.setValue('media', e.target.files[0]);
    }
  };

  return (
    <div className="rounded-lg border bg-card p-4 mb-6">
      <h2 className="text-lg font-semibold mb-3">Criar nova postagem</h2>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Textarea 
                    placeholder="Digite sua mensagem..." 
                    className="min-h-[100px] resize-none"
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          
          <div className="flex items-center gap-2">
            <Input
              type="file"
              id="mediaUpload"
              accept="image/*,video/*"
              className="hidden"
              onChange={handleFileChange}
            />
            <label 
              htmlFor="mediaUpload" 
              className="cursor-pointer px-4 py-2 border rounded-md text-sm hover:bg-accent"
            >
              {selectedFile ? selectedFile.name : "Adicionar mídia"}
            </label>
            
            <Button 
              type="submit" 
              className="ml-auto flex gap-2 items-center" 
              disabled={isSubmitting}
            >
              Publicar
              <Send size={16} />
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default PostForm;
