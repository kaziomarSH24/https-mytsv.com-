<?php

namespace App\Enums\Video;

enum Package: int {
    case FREE = 1;
    case FILE = 2;
    case PROMOTED = 3;
    case PREMIUM = 4;
}
