<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use \DateTimeInterface;

class ReviewsCaptin extends Model
{
    use SoftDeletes;

    public $table = 'reviews_captins';

    protected $dates = [
        'created_at',
        'updated_at',
        'deleted_at',
    ];

    protected $fillable = [
        'captin_id',
        'user_id',
        'review',
        'note',
        'created_at',
        'updated_at',
        'deleted_at',
    ];

    protected function serializeDate(DateTimeInterface $date)
    {
        return $date->format('Y-m-d H:i:s');
    }

    public function captin()
    {
        return $this->belongsTo(User::class, 'captin_id');
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}
