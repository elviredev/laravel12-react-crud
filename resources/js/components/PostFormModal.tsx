import React, { useState, useEffect } from 'react';
import { router } from '@inertiajs/react'
import { Post } from '@/types/post'
import { Toaster } from "@/components/ui/sonner"
import { toast } from "sonner"

interface Props {
    post?: Post | null;
    closeModal: () => void;
    isOpen: boolean;
}

const PostFormModal = ({post, closeModal, isOpen}: Props) => {
    const [formData, setFormData] = useState<Post>({
        title: "",
        content: "",
        picture: "",
    });
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [preview, setPreview] = useState("");

    useEffect(() => {
        if (post) {
            setFormData({title: post.title, content: post.content, picture: post.picture || ""});
            setPreview(post.picture || "");
            setSelectedFile(null)
        } else {
            setFormData({title: "", content: "", picture: ""});
            setPreview("");
            setSelectedFile(null)
        }
    }, [post, isOpen]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if(e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setSelectedFile(file);
            setPreview(URL.createObjectURL(file));
        }
    }

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const data = new FormData();
      data.append("title", formData.title);
      data.append("content", formData.content);
      if (selectedFile) {
        data.append("picture", selectedFile);
      }

      const successMessage = post?.id ? "Post updated successfully 😊" : "Post created successfully 😊";
      const errorMessage = post?.id ? "Failed to update post 🙃" : "Failed to create post 🙃";

      if(post?.id) { // Modifier un article
        data.append("_method", "PUT");
        router.post(route('posts.update', post.id), data, {
          onSuccess: () => {
            toast.success(successMessage)
            closeModal();
            router.reload();
          },
          onError: (errors) => {
            toast.error(errorMessage)
            console.error(errors.message ||'Failed to update post.');
          }
        })
      } else { // Créer un article
        router.post(route('posts.store'), data, {
          onSuccess: () => {
            toast.success(successMessage)
            closeModal();
            router.reload();
          },
          onError: (errors) => {
            toast.error(errorMessage)
            console.error(errors.message ||'Failed to create post.');
          }
        })
      }
    }

    if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-xl">
        <h2 className="text-lg font-semibold mb-4">
          {post ? "Edit Post" : "Add Post"}
        </h2>

        <form
          onSubmit={handleSubmit}
          encType="multipart/form-data"
        >
          <div className="mb-3">
            <label htmlFor="title" className="block text-sm font-medium">Title</label>
            <input
              type="text"
              name="title"
              id="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full border rounded p-2"
              required
            />
          </div>

          <div className="mb-3">
            <label htmlFor="content" className="block text-sm font-medium">Content</label>
            <textarea
              name="content"
              id="content"
              value={formData.content}
              onChange={handleChange}
              className="w-full border rounded p-2"
              required
            ></textarea>
          </div>

          <div className="mb-3">
            <label htmlFor="picture" className="block text-sm font-medium">Picture (optional)</label>
            <input
              type="file"
              name="picture"
              id="picture"
              onChange={handleFileChange}
              className="w-full"
              accept="image/*"
            />
          </div>

          {preview && (
            <div className="mb-3">
              <p className="text-sm mb-1">Image Preview:</p>
              <img src={preview} alt="Preview" className="w-32 h-32 object-cover rounded" />
            </div>
          )}
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={closeModal}
              className="px-4 py-2 bg-gray-500 text-white rounded cursor-pointer hover:bg-gray-600"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded cursor-pointer hover:bg-blue-700"
            >
              {post ? "Update" : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
export default PostFormModal;
