<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use \DateTimeInterface;

class Advertice extends Model
{
    use SoftDeletes;

    public $table = 'advertices';

    protected $dates = [
        'created_at',
        'updated_at',
        'deleted_at',
    ];

    protected $fillable = ['course_id', 'title', 'image', 'url', 'hour', 'people_no','price', 'time', 'status', 'created_at', 'updated_at', 'deleted_at'];


    protected function serializeDate(DateTimeInterface $date)
    {
        return $date->format('Y-m-d H:i:s');
    }
    public function course()
    {
        return $this->belongsTo(Course::class);
    }
}
