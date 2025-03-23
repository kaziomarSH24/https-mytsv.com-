<?php

namespace App\Http\Controllers\Admin;

use App\Models\Video;
use App\Models\Category;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Validator;

class CategoryController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->query('search');

        $query = Category::withCount('videos')->orderBy('videos_count', 'desc');

        if ($search) {
            $query->where('title', 'LIKE', "%{$search}%");
        }

        $users = $query->paginate(9);

        return response()->json($users);
    }
    public function show($id)
    {
        $category = Category::find($id);
        $videos = Video::with('user')->where('category_id', $id)->get();
        return response()->json(compact('category', 'videos'));
    }
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'id' => 'nullable|exists:categories,id',
            'title' => 'required|string|max:30',
        ]);

        if ($validator->fails()) {
            return response()->json(['status' => 'error', 'errors' => $validator->errors()], 400);
        }


        $category = Category::find($request->id);
        if ($category) {
            $category->update([
                'title' => $request->title,
            ]);
            return response()->json($category);
        }
        return response()->json(['status' => 'error', 'message' => 'Category not found'], 404);
    }
    public function destroy($id)
    {
        $category = Category::with('videos')->find($id);
        if ($category) {
            $category->videos()->delete();
            $category->delete();
            return response()->json(['status' => 'success', 'message' => 'Category and related videos deleted successfully']);
        }
        return response()->json(['status' => 'error', 'message' => 'Category not found'], 404);
    }

}
