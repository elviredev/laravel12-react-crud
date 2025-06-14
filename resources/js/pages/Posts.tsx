import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router, usePage } from '@inertiajs/react';
import PostFormModal from '@/components/PostFormModal';
import { useState } from 'react';
import { Post } from '@/types/post';
import { Toaster } from "@/components/ui/sonner"
import { toast } from "sonner"

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Articles',
    href: '/posts',
  },
];


export default function Posts() {

  const { posts } = usePage<{ posts:
      { id: number; title: string; content: string; picture?: string }[]
  }>().props

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);

  const openModal = (post: Post | null) => {
    setSelectedPost(post);
    setIsModalOpen(true);
  };

  const handleDelete = (id: number) => {
    router.delete(route('posts.destroy', id), {
      onSuccess: () => {
        toast.success('Post deleted successfully 😊');
        router.reload();
      },
      onError: () => {
        toast.error('Failed to delete post 🙃');
        console.error('Failed to delete post.');
      }
    });
  };


  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Articles" />

      <Toaster position="top-right" richColors />

      <div className="flex flex-col gap-6 p-6 bg-white text-black shadow-lg rounded-xl">
        <div className="flex justify-end ">
          <button
            onClick={() => openModal(null)}
            className="rounded bg-green-600 px-3 py-1 text-sm font-medium text-white hover:bg-green-700 transition-colors"
          >
            Add Post
          </button>
        </div>
        {/* Table pour écran médium et plus */}
        <table className="w-full border-collapse bg-white text-black shadow-sm rounded-lg hidden md:table ">
          <thead>
          <tr className="bg-gray-100 text-gray-800 border-b">
            {['Picture', 'Title', 'Content', 'Actions'].map((header) => (
              <th
                key={header}
                className="border p-3 text-left last:text-right"
              >
                {header}
              </th>
            ))}
          </tr>
          </thead>
          <tbody>
          {posts.length ? (
            posts.map((post) => (
              <tr key={post.id} className="border-b">
                <td className="p-3">
                  {post.picture ?
                    <img
                      src={post.picture}
                      alt={post.title}
                      className="max-w-[80px] max-h-[80px] object-cover rounded-full"
                    /> : <p>No Picture</p>}
                </td>
                <td className="p-3">{post.title}</td>
                <td className="p-3">{post.content}</td>
                <td className="p-3 flex justify-end gap-2">
                  <button
                    onClick={() => openModal(post)}
                    className="bg-blue-500 text-sm text-white px-3 py-1 rounded"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(post.id)}
                    className="bg-red-500 text-sm text-white px-3 py-1 rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={4} className="text-center p-4 text-gray-600">Pas d'articles</td>
            </tr>
          )}
          </tbody>
        </table>

        {/* Cartes pour mobile */}
        <div className="block md:hidden">
          {posts.length ? (
            posts.map((post) => (
              <div key={post.id} className="boder rounded-lg shadow-sm p-4 mb-4 bg-white">
                <div className="flex items-center gap-4 mb-2">
                  {post.picture ? (
                    <img
                      src={post.picture}
                      alt={post.title}
                      className="max-w-[80px] max-h-[80px] object-cover rounded-full"
                    />
                  ) : (
                    <div className="w-16 h-16 flex items-center justify-center bg-gray-200 rounded-full text-sm text-gray-500">No Picture</div>
                  )}
                  <h2 className="text-lg font-semibold">{post.title}</h2>
                </div>

                <p className="text-gray-700 mb-3">{post.content}</p>

                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => openModal(post)}
                    className="bg-blue-500 text-sm text-white px-3 py-1 rounded"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(post.id)}
                    className="bg-red-500 text-sm text-white px-3 py-1 rounded"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-600">Pas d'articles</p>
          )}
        </div>
      </div>

      <PostFormModal
        post={selectedPost}
        isOpen={isModalOpen}
        closeModal={() => setIsModalOpen(false)}
      />

    </AppLayout>
  );
}
