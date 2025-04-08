<?php

namespace App\Http\Controllers\Main;

use App\Enums\Video\Package;
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
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
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
    // return "hello";
    $videoPage = request('video_page', 1);
    $location_id = request('location_id', null);

    $categories = Category::has('videos')->paginate(3);

    $categories->getCollection()->transform(function ($category) use ($videoPage, $location_id) {
        $category->paginated_videos = $this->getSortedPaginatedVideos($category, $location_id, $videoPage, 8);
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
        $location_id = $request->location_id;
        $page = $request->get('page', 1);

        $videos = $this->getSortedPaginatedVideos($category, $location_id, $page, 12);

        if ($videos->isEmpty()) {
            return response()->json([
                'success' => false,
                'message' => 'No videos found'
            ], 200);
        }

        return response()->json($videos);
    }


    public function getPromotionalVideos(Request $request)
{
    // return "hello";
    $location_id = $request->input('location_id');

    $query = Video::with('user', 'category')
        ->Promotional();

    if ($location_id) {
        $query->where('location_id', $location_id);
    }

    $videos = $query->orderBy('package', 'desc')->paginate(12);

    if ($videos->isEmpty()) {
        $videos = null;
    }

    return response()->json([
        'success' => true,
        'data' => $videos
    ]);
}


private function getSortedPaginatedVideos($category, $location_id = null, $page = 1, $perPage = 12)
{
    $query = $category->videos()->with('user');

    if ($location_id) {
        $query->where('location_id', $location_id);
    }

    $oneMonthAgo = now()->subMonth();

    $topVideos = (clone $query)
        ->Promotional()
        ->orderBy('created_at', 'desc')
        ->get();

    $otherVideos = (clone $query)
        ->where(function ($q) use ($oneMonthAgo) {
            $q->whereNotIn('package', [Package::PROMOTED, Package::PREMIUM])
              ->orWhere('created_at', '<', $oneMonthAgo);
        })
        ->inRandomOrder()
        ->get();

    $allVideos = $topVideos->concat($otherVideos);

    return new \Illuminate\Pagination\LengthAwarePaginator(
        $allVideos->forPage($page, $perPage)->values(),
        $allVideos->count(),
        $perPage,
        $page,
        ['path' => request()->url(), 'query' => request()->query()]
    );
}

}
