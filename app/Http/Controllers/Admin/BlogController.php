<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Blog;
use Auth;
use Illuminate\Http\Request;
use Str;
use Validator;

class BlogController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->query('search');

        $query = Blog::query();

        if ($search) {
            $query->where('title', 'LIKE', "%{$search}%");
        }

        $blogs = $query->paginate(9);

        return response()->json($blogs);
    }
    public function show($id)
    {
        $blog = Blog::find($id);
        return response()->json($blog);
    }
    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|min:3',
            'description' => 'required',
            'body' => 'required',
        ]);

        $slug = Str::slug($request->title);
        $counter = 1;
        do {
            $videoSlug = $counter > 1 ? $slug . '-' . $counter : $slug;
            $counter++;
        } while (Blog::where('slug', $videoSlug)->exists());


        $blog = Blog::find($request->id) ?? new Blog();
        if ($request->file('thumbnail')) {
            $thumbnail = $blog->generateImage($request->file('thumbnail'), $videoSlug);
        } else {
            $thumbnail = $blog->thumbnail;
        }

        $blog = $blog->updateOrCreate(
            [
                'id' => $request->id ?? null
            ],
            [
                'title' => $request->title,
                'slug' => $videoSlug,
                'thumbnail' => json_encode($thumbnail),
                'body' => $request->body,
                'description' => $request->description,
                'user_id' => Auth::user()->id,
            ]
        );

        return response()->json(['status' => $blog ? 'success' : 'error']);
    }
    public function destroy($id)
    {
        $blog = Blog::find($id)->delete();
        return response()->json(['status' => $blog ? 'success' : 'error']);
    }
}
