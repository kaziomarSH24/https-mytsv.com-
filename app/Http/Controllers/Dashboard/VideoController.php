<?php

namespace App\Http\Controllers\Dashboard;

use App\Models\View;
use App\Models\Video;
use App\Models\Location;
use App\Enums\Video\Status;
use App\Models\Transaction;
use Illuminate\Support\Str;
use App\Enums\Video\Package;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;

class VideoController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->query('search');
        $status = Status::WAITING->value;

        $query = Video::with('user')->orderByRaw("status = {$status} DESC")->latest();

        if ($search) {
            $query->search($search);
        }

        if (!Auth::user()->admin) {
            $query->where('user_id', Auth::user()->id);
        }

        $videos = $query->paginate(9);

        return response()->json($videos);
    }
    public function show($id)
    {
        $video = Video::find($id);
        return response()->json($video);
    }
    public function store(Request $request)
    {
        $userId = Auth::user()->id;
        // $request->validate([
        //     'title' => 'required',
        //     'description' => 'required',
        //     'price' => 'required|integer',
        //     'video' => 'required',
        //     'thumbnail' => 'required',
        //     'category' => 'required',
        // ]);

        $validation = Validator::make($request->all(), [
            'title' => 'required|string|max:255',
            'description' => 'required',
            'price' => 'required|integer',
            'video' => 'required',
            'thumbnail' => $request->id ? 'nullable' : 'required|' ."image|mimes:jpeg,png,jpg,svg",
            'category' => 'required',
            ]);

        if ($validation->fails()) {
            return response()->json([
                'status' => 'error',
                'errors' => $validation->errors()->first(),
            ], 422);
        }



        // Log::info("Upload video",$request->all());

        $status = Status::WAITING;
        $package = Package::FREE;

        if ($request->promoted == 'true') {
            $package = Package::PROMOTED;
        }

        $video = new Video();

        $slug = Str::slug($request->title);
        $counter = 1;
        do {
            $videoSlug = $counter > 1 ? $slug . '-' . $counter : $slug;
            $counter++;
        } while (Video::withTrashed()->where('slug', $videoSlug)->exists());

        if ($request->file('video')) {
            $videoName = 'videos/' . $videoSlug . '.mp4';
            // Create directory if it doesn't exist
            $videoDirectory = public_path('storage/videos');
            if (!file_exists($videoDirectory)) {
                mkdir($videoDirectory, 0755, true);
            }
            $request->video->move($videoDirectory, $videoSlug . '.mp4');
            if ($package == Package::PROMOTED) {
                $package = Package::PREMIUM;
            } else {
                $package = Package::FILE;
            }
        } else {
            $videoName = $request->video;
            //if video is youtube link it already published
            $status = Status::PUBLISHED;
        }

        if ($request->file('thumbnail')) {
            // Create thumbnail directories
            $thumbnailBaseDir = public_path('storage/videos/' . $videoSlug);
            if (!file_exists($thumbnailBaseDir)) {
                mkdir($thumbnailBaseDir, 0755, true);
            }

            $thumbnail = $video->generateImage($request->file('thumbnail'), $videoSlug);
        } else {
            $thumbnail = $request->thumbnail;
        }

        if ($request->location) {
            $location = Location::find($request->location);
        }

        $video = Video::updateOrCreate([
            'id' => $request->id
        ], [
            'slug' => $videoSlug,
            'video' => $videoName,
            'user_id' => $userId,
            'title' => $request->title,
            'price' => $request->price,
            $request->id ? '' : 'thumbnail' => json_encode($thumbnail),
            'status' => $status,
            'package' => $package,
            'category_id' => $request->category,
            'location_id' => $location->id ?? 1,
            'description' => $request->description,
        ]);

        if ($package !== Package::FREE) {
            $video->delete();
            $transaction = new Transaction();
            $res = $transaction->createOrder($package, $video->id);
            return response()->json(['url' => $res->url]);
        }

        return response()->json($video);
    }
    public function views($id, Request $request)
    {
        $views = View::getViewsForPeriod($id, $request->period);
        return response($views);
    }
    public function moderation(Request $request)
    {
        if (!Auth::user()->admin)
            return;

        $video = Video::find($request->id);

        if (!$video)
            return;

        if ($request->status == 'delete') {
            $video->delete();
            return response()->json(['status' => 'success']);
        }

        if ($request->file('video')) {
            $videoName = 'videos/' . $video->slug . '.mp4';
            $request->video->move(public_path('storage/videos'), $videoName);
        } else {
            $videoName = $request->video;
        }
        $video = $video->update([
            'video' => $videoName,
            'status' => Status::fromName($request->status),
        ]);
        return response()->json(['status' => 'success']);
    }
    public function destroy($id){
        $video = Video::find($id)->delete();
        return response()->json(['status'=> $video ? 'success' : 'error']);
    }
}
