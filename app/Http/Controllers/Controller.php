<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Foundation\Bus\DispatchesJobs;
use Illuminate\Routing\Controller as BaseController;
use Illuminate\Foundation\Validation\ValidatesRequests;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;

class Controller extends BaseController
{
    use AuthorizesRequests, DispatchesJobs, ValidatesRequests;

    public $templateFile = 'index.html';

    public function firstLoader(Request $request)
    {
        if (!is_file($this->templateFile)) return '<h1>Something Went Wrong...</h1>';
        $template = file_get_contents($this->templateFile);

        $title = 'Meet Your Town Specialists - MyTSV';
        $description = 'Search for your local specialists in various fields, read reviews and specialists an appointment online.';
        $keywords = 'videos, specialists, local, town, search, reviews, appointment, online, mytsv, meet your town specialists';
        $image = 'mytsv.com';

        $placeHolders = '
            <meta name="title" content="'.$title.'">
            <meta name="description" content="'.$description.'">
            <meta name="keywords" content="'.$keywords.'">
            <meta name="og:image" content="'.$image.'">
        ';

        $template = str_replace('<placeholder_meta></placeholder_meta>', $placeHolders, $template);
        if (isset($title)) {
            $template = str_replace("<title></title>", "<title>{$title}</title>", $template);
        }

        return $template;
    }
}
