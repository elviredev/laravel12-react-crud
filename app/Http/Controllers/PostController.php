<?php

namespace App\Http\Controllers;

use App\Models\Post;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class PostController extends Controller
{
  /**
   * Display a listing of the resource.
   */
  public function index(): Response
  {
    return Inertia::render('Posts', [
      'posts' => Post::all()
    ]);
  }

  /**
   * Show the form for creating a new resource.
   */
  public function create()
  {
      //
  }

  /**
   * Store a newly created resource in storage.
   */
  public function store(Request $request)
  {
    $request->validate([
      'title' => 'required|string|max:255',
      'content' => 'required|string',
      'picture' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
    ]);

    $data = $request->only(['title', 'content']);

    if ($request->hasFile('picture')) {
      $file = $request->file('picture');
      $filename = time() . '.' . $file->getClientOriginalExtension();
      $path = $file->storeAs('uploads', $filename, 'public');
      $data['picture'] = '/storage/' . $path;
    }

    Post::create($data);
    return redirect()->route('posts.index')->with('success', 'Post created successfully.');
  }

  /**
   * Display the specified resource.
   */
  public function show(string $id)
  {
      //
  }

  /**
   * Show the form for editing the specified resource.
   */
  public function edit(string $id)
  {
      //
  }

  /**
   * Update the specified resource in storage.
   */
  public function update(Request $request, Post $post)
  {
    $request->validate([
      'title' => 'required|string|max:255',
      'content' => 'required|string',
      'picture' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
    ]);

    $data = $request->only(['title', 'content']);

    if ($request->hasFile('picture')) {
      // Supprimer l'ancienne image
      if ($post->picture) {
        $oldPath = str_replace('/storage/', '', $post->picture);
        Storage::disk('public')->delete($oldPath);
      }

      // Stocker la nouvelle image
      $file = $request->file('picture');
      $filename = time() . '.' . $file->getClientOriginalExtension();
      $path = $file->storeAs('uploads', $filename, 'public');
      $data['picture'] = '/storage/' . $path;
    }

    $post->update($data);
    return redirect()->route('posts.index')->with('success', 'Post updated successfully.');
  }

  /**
   * Remove the specified resource from storage.
   */
  public function destroy(Post $post)
  {
    // Supprimer l'image si elle xiste
    if ($post->picture) {
      $path = str_replace('/storage/', '', $post->picture);
      Storage::disk('public')->delete($path);
    }

    $post->delete();
    return redirect()->route('posts.index')->with('success', 'Post deleted successfully.');
  }
}
