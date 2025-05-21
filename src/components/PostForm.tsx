
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormField, FormItem, FormControl } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Send, X, Image } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

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
      
      // Upload media if selected
      if (selectedFile) {
        const fileExt = selectedFile.name.split('.').pop();
        const fileName = `${uuidv4()}.${fileExt}`;
        const filePath = `${user.id}/${fileName}`;
        
        const { error: uploadError, data } = await supabase
          .storage
          .from('posts')
          .upload(filePath, selectedFile);
        
        if (uploadError) throw uploadError;

        // Get public URL for the file
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
      setPreviewUrl(null);
      
      toast({
        title: "Postagem criada",
        description: "Sua postagem foi publicada com sucesso!",
      });
      
    } catch (error) {
      console.error('Error creating post:', error);
      toast({
        title: "Erro",
        description: "Não foi possível criar a postagem. Por favor, tente novamente.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      form.setValue('media', file);
      
      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    form.setValue('media', undefined);
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
          
          {previewUrl && (
            <div className="relative mt-2">
              <div className="rounded-lg overflow-hidden border">
                {selectedFile?.type.startsWith('image/') ? (
                  <img 
                    src={previewUrl} 
                    alt="Preview" 
                    className="w-full h-auto max-h-64 object-contain"
                  />
                ) : selectedFile?.type.startsWith('video/') ? (
                  <video 
                    src={previewUrl} 
                    controls
                    className="w-full max-h-64"
                  />
                ) : null}
              </div>
              <button 
                type="button" 
                onClick={handleRemoveFile}
                className="absolute top-2 right-2 bg-black bg-opacity-60 text-white rounded-full p-1 hover:bg-opacity-80"
              >
                <X size={16} />
              </button>
            </div>
          )}
          
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
              className="cursor-pointer px-4 py-2 border rounded-md text-sm hover:bg-accent flex items-center gap-2"
            >
              <Image size={16} />
              {selectedFile ? "Alterar mídia" : "Adicionar mídia"}
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
