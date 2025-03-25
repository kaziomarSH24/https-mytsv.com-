<?php

namespace App\Http\Controllers\Main;

use App\Models\Blog;
use App\Models\User;
use App\Models\View;
use App\Models\Video;
use App\Models\Review;
use App\Models\Setting;
use App\Models\Category;
use App\Models\Location;
use App\Models\Interaction;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Session;
use Illuminate\Support\Facades\Validator;

class MainController extends Controller
{
    public function primary(Request $request)
    {
        $user = Auth::user();
        $data['user'] = $user;
        $data['locations'] = $this->getLocations();
        $data['categories'] = $this->getCategories();
        $data['settings'] = Setting::all()->pluck('value', 'name');

        return response($data);
    }
    public function getVideos(Request $request)
    {
        $video = new Video();
        $videos = $video->getVideos($request);
        return response($videos);
    }
    public function getVideo($slug, Request $request)
    {
        $video = Video::with([
            'comments' => function ($query) {
                $query->with('replies');
                $query->where('parent_id', null);
            },
            'user:avatar,name,id',
            'category',
        ])->where('slug', $slug)->first();

        if ($video->id) {
            $view = new View();
            $view->setView($video->id, $request->ip());
        }

        if (Auth::user()) {
            $interaction = Interaction::where('user_id', Auth::user()->id)->where('video_id', $video->id)->first();
            if ($interaction)
                $video['interaction'] = $interaction->is_liked ? 'like' : 'dislike';
        } else {
            $video['interaction'] = false;
        }

        return response()->json($video);
    }
    public function getUser(Request $request)
    {
        // return $request->all();
        $request->validate([
            'id' => 'required|integer',
        ]);

        $res['user'] = User::where('id', $request->id)->first();
        $res['videos'] = Video::with('user')->withCount('views')->published()->where('user_id', $res['user']->id)->orderBy('views_count', 'desc')->take(3)->get();
        $res['reviews'] = Review::where('user_id', $res['user']->id)->latest()->get();
        return response($res);
    }
    public static function resolveLocation(Request $request)
    {
        $location = Session::get('location') ? json_decode(Session::get('location')) : Location::location($request->ip());

        if ($location) {
            Session::put('location', json_encode($location));
        }
        return $location;
    }
    public function getCategories()
    {
        $res = Category::withCount('videos')->orderBy('videos_count', 'desc')->get();
        return $res;
    }
    public function getLocations($parent = null)
    {
        $query = Location::with('parent');

        if ($parent) {
            $query->where('parent_id', $parent);
        } else {
            $query->where('parent_id', null);
        }

        $locations = $query->pluck('title', 'id');

        return $locations;
    }
    public function addReview(Request $request)
    {
        $request->validate([
            'name' => 'string|required|min:3',
            'user' => 'required|exists:users,id'
        ]);

        $res = Review::create([
            'name' => $request->name,
            'user_id' => $request->user,
            'rating' => $request->rating,
            'comment' => $request->comment,
        ]);
        return response($res);
    }
    public function updateLocation(Request $request)
    {
        $request->validate([
            'state' => 'required|string',
            'city' => 'required|string',
        ]);
        Session::put('location', json_encode($request->only(['state', 'city'])));
        return response()->json(['message' => 'Location updated successfully']);
    }
    public function getBlogs(Request $request)
    {
        $blogs = Blog::latest()->paginate(9);
        return response()->json($blogs);
    }
    public function getBlog($slug)
    {
        $blog = Blog::where('slug', $slug)->first();
        return response()->json($blog);
    }


    //get all videos with category
    public function getCategoryVideos(Request $request)
    {
        $videoPage = request('video_page', 1);

        $categories = Category::has('videos')->paginate(3);

        $categories->getCollection()->transform(function ($category) use ($videoPage) {
            $category->paginated_videos = $category->videos()->with('user')->paginate(8, ['*'], 'video_page', $videoPage);
            return $category;
        });

        if ($categories->isEmpty()) {
            return response()->json([
                'success' => false,
                'message' => 'No categories found'
            ], 404);
        }

        return response()->json($categories);
    }

    //get category videos by category id
    public function getCategoryVideosById(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'category_id' => 'required|integer|exists:categories,id'
        ]);
        if($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => $validator->errors()->first()
            ], 400);
        }

        $category = Category::find($request->category_id);

        if (!$category) {
            return response()->json([
                'success' => false,
                'message' => 'Category not found'
            ], 404);
        }

        $videos = $category->videos()->with('user')->paginate(12);

        return response()->json($videos);
    }
}
