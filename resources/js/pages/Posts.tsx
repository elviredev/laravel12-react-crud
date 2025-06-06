import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router, usePage } from '@inertiajs/react';
import PostFormModal from '@/components/PostFormModal';
import { useState } from 'react';

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
  const [selectedPost, setSelectedPost] = useState(null);

  const openModal = (post: null) => {
    setSelectedPost(post);
    setIsModalOpen(true);
  };

  const handleDelete = (id: number) => {
    router.delete(route('posts.destroy', id), {
      onSuccess: () => {
        router.reload();
      },
      onError: () => {
        console.error('Failed to delete post.');
      }
    });
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Articles" />

      <div className="flex flex-col gap-6 p-6 bg-white text-black shadow-lg rounded-xl">
        <div className="flex justify-end ">
          <button
            onClick={() => openModal(null)}
            className="rounded bg-green-600 px-3 py-1 text-sm font-medium text-white hover:bg-green-700 transition-colors"
          >
            Add Post
          </button>
        </div>

        <table className="w-full border-collapse bg-white text-black shadow-sm rounded-lg ">
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
                      className="w-16 h-16 object-cover rounded-full"
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
      </div>

      <PostFormModal
        post={selectedPost}
        isOpen={isModalOpen}
        closeModal={() => setIsModalOpen(false)}
      />

    </AppLayout>
  );
}
