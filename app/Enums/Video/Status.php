<?php

namespace App\Enums\Video;

enum Status: int
{
    case PUBLISHED = 1;
    case WAITING = 2;
    case CANCELED = 3;

    public static function fromName(string $name)
    {
        return constant("self::$name");
    }
}
